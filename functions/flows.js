import { Graph } from "@minus/gee3"
import { RunStatus, airtable, getFlow, getFlowGraph, google, openai, updateFlow } from "@minus/server-lib"
import { loadNodeDefinitions } from "@minus/server-nodes"
import { FieldValue } from "firebase-admin/firestore"
import { getFunctions } from "firebase-admin/functions"
import functions from "firebase-functions"
import { db } from "./init.js"


const withSecret = functions.runWith({
    secrets: [
        airtable.airtableOAuthClientSecret,
        google.googleOAuthClientSecret,
        openai.openaiSecretKey,
    ]
})


export const runWritten = withSecret.firestore.document("flowRuns/{flowRunId}").onWrite(async (change) => {

    // Quit if document is deleted
    if (!change.after.exists)
        return

    // Grab run
    const run = { id: change.after.id, ...change.after.data() }

    const debugPrefix = `[Flow: ${run.flow}, Run: ${run.id}]`

    try {
        switch (run.status) {
            /**
             * Pending - validate flow
             */
            case RunStatus.Pending: {
                const { valid, errors } = await _validate(run.flow, run.payload)

                const status = valid ?
                    RunStatus.Validated :
                    RunStatus.FailedValidation

                await change.after.ref.update({
                    status,
                    validationErrors: errors ?? null,
                    validatedAt: FieldValue.serverTimestamp()
                })

                console.debug(debugPrefix, `Finished validation with status: "${status}"`)
                break
            }

            /**
             * Scheduled - enqueue flow to run at scheduled time
             */
            case RunStatus.Scheduled: {

                if (!run.scheduledFor)
                    throw new Error("Scheduled run doesn't include a time in 'scheduledFor' field")

                await getFunctions().taskQueue("flow-startScheduledRun").enqueue({
                    flowRunId: run.id
                }, {
                    scheduleTime: new Date(run.scheduledFor.toMillis()),
                })

                console.debug(debugPrefix, `Scheduled flow`)
                break
            }

            /**
             * Validated - run flow, store results, index edges
             */
            case RunStatus.Validated: {

                console.debug(debugPrefix, "Running flow")

                // Load flow
                const flow = await Flow.fromId(run.flow)

                // Globalize some info
                global.info = {
                    flow,
                    flowId: flow.id,
                    app: flow.app,
                    appId: flow.app.id,
                }

                // Run flow
                const { errors, inputs, outputs, returns } = await flow.run(run.payload)

                // update doc with run info
                const status = Object.keys(errors).length ? RunStatus.FinishedWithErrors : RunStatus.Finished
                await change.after.ref.update({
                    status,
                    errors,
                    inputs,
                    outputs,
                    returns,
                    ranAt: FieldValue.serverTimestamp(),
                })

                // Index the flow's edges if it was successful
                try {
                    if (status == RunStatus.Finished)
                        await flow.graph.indexEdges()
                }
                catch (err) {
                    console.error(err)
                }

                console.debug(debugPrefix, `Finished with status: "${status}"`)
                break
            }
        }
    }
    catch (error) {
        await change.after.ref.update({
            status: RunStatus.Failed,
            failureError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        })
    }
})


/**
 * Publish a flow
 */
export const publish = withSecret.https.onCall(async ({ flowId }) => {

    // Load flow
    const flow = await getFlow(flowId)
    const flowGraph = await getFlowGraph(flow.graph, {
        parse: true,
    })

    // Load node definitions
    const NodeDefinitions = await loadNodeDefinitions()

    // Run deploy routine for each node
    await Promise.all(
        flowGraph.nodes.map(
            node => NodeDefinitions[node.type].onDeploy?.call(node, {
                flow,
            })
        )
    )

    // Update published field
    await updateFlow(flowId, { published: true })
})


/**
 * Unpublish a flow
 */
export const unpublish = withSecret.https.onCall(async ({ flowId }) => {

    // Load flow
    const flow = await getFlow(flowId)
    const flowGraph = await getFlowGraph(flow.graph, {
        parse: true,
    })

    // Load node definitions
    const NodeDefinitions = await loadNodeDefinitions()

    // Run deploy routine for each node
    await Promise.all(
        flowGraph.nodes.map(
            node => NodeDefinitions[node.type].onUndeploy?.call(node, {
                flow,
            })
        )
    )

    // Update published field
    await updateFlow(flowId, { published: false })
})


/**
 * Start a run scheduled previously
 */
export const startScheduledRun = withSecret.tasks.taskQueue().onDispatch(async ({ flowRunId }) => {
    await db.doc(`flowRuns/${flowRunId}`).update({ status: RunStatus.Pending })
})


/**
 * Run a flow from a URL
 */
export const runFromUrl = withSecret.https.onRequest(async (req, res) => {

    // allow CORS from all origins
    res.set("Access-Control-Allow-Origin", "*")

    const flowId = req.query.flow_id

    // Insert run document
    const runRef = await db.collection("flowRuns").add({
        flow: flowId,
        payload: req.body,
        status: RunStatus.Pending,
        source: "url",
    })

    // watch and wait
    const unsubscribe = runRef.onSnapshot(snapshot => {
        const run = { id: snapshot.id, ...snapshot.data() }

        switch (run.status) {
            case RunStatus.Finished:
            case RunStatus.FinishedWithErrors:
                unsubscribe()
                res.send(run)
                return
            case RunStatus.Failed:
            case RunStatus.FailedValidation:
                unsubscribe()
                res.status(500).send(run)
                return
        }
    })
})


async function _validate(flowId, payload) {

    // Load flow
    const flow = await getFlow(flowId)
    const flowGraph = await getFlowGraph(flow.graph, {
        parse: true,
    })

    // Ensure flow is enabled
    if (!flow.published)
        throw new Error("Flow is not enabled")

    const NodeDefinitions = await loadNodeDefinitions()

    // Run validate routine for each node
    const errors = await Promise.all(
        flowGraph.nodes.map(async node => {
            try {
                await NodeDefinitions[node.type].validate?.call(node, {
                    flow,
                    payload,
                })
            }
            catch (err) {
                return JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
            }
        })
    ).then(errors => errors.filter(Boolean))

    return {
        valid: !errors.length,
        errors,
    }
}


class Flow {
    static async fromId(flowId, options) {
        const flow = new Flow(flowId)
        await flow.load(options)
        return flow
    }

    constructor(id) {
        this.id = id
    }

    get ref() {
        return db.doc(`flows/${this.id}`)
    }

    async load({
        includeGraph = true,
        includeApp = true,
    } = {}) {
        const flowDoc = await this.ref.get()

        if (!flowDoc.exists)
            throw new Error(`Flow with ID ${this.id} doesn't exist`)

        Object.entries(flowDoc.data())
            .forEach(([key, val]) => this[key] = val)

        if (includeGraph)
            this.graph = await FlowGraph.fromId(this.graph)

        if (includeApp)
            this.app = await App.fromId(this.app)
    }

    update(data) {
        return this.ref.update(data)
    }

    async run(payload) {
        if (!this.graph?.nodes || !this.graph?.edges)
            throw new Error("This flow's graph isn't loaded properly")

        const graph = new Graph(this.graph.nodes, this.graph.edges)
        return graph.run(payload, {
            promiseStreamOptions: {
                logErrors: true,
            }
        })
    }
}


class FlowGraph {
    static async fromId(flowGraphId) {
        const flowGraph = new FlowGraph(flowGraphId)
        await flowGraph.load()
        return flowGraph
    }

    constructor(id) {
        this.id = id
    }

    get ref() {
        return db.doc(`flowGraphs/${this.id}`)
    }

    async load() {
        const flowGraphDoc = await this.ref.get()

        if (!flowGraphDoc.exists)
            throw new Error(`Flow Graph with ID ${this.id} doesn't exist`)

        Object.entries(JSON.parse(flowGraphDoc.data().graph))
            .forEach(([key, val]) => this[key] = val)
    }

    update(data) {
        return this.ref.update(data)
    }

    /**
     * Tracks which handles are commonly connected with other
     * handles. This powers node suggestions.
     *
     * @memberof FlowGraph
     */
    async indexEdges() {

        // create updates -- a double map of occurences of edges
        const updates = {}
        this.edges.forEach(edge => {
            const sourceType = this.findNodeWithId(edge.source).type
            const targetType = this.findNodeWithId(edge.target).type

            // update with source as key
            updates[sourceType] ??= {}
            updates[sourceType][edge.sourceHandle] ??= {}
            updates[sourceType][edge.sourceHandle][targetType] ??= {}
            updates[sourceType][edge.sourceHandle][targetType][edge.targetHandle] ??= { timesSuccessful: FieldValue.increment(0) }
            updates[sourceType][edge.sourceHandle][targetType][edge.targetHandle].timesSuccessful.operand++

            // update with target as key
            updates[targetType] ??= {}
            updates[targetType][edge.targetHandle] ??= {}
            updates[targetType][edge.targetHandle][sourceType] ??= {}
            updates[targetType][edge.targetHandle][sourceType][edge.sourceHandle] ??= { timesSuccessful: FieldValue.increment(0) }
            updates[targetType][edge.targetHandle][sourceType][edge.sourceHandle].timesSuccessful.operand++
        })

        const edgeIndexCollection = db.collection("edgeIndex")
        const batch = db.batch()

        Object.entries(updates).forEach(([docId, docUpdates]) => {
            // merge into document
            batch.set(edgeIndexCollection.doc(docId), docUpdates, { merge: true })
        })

        await batch.commit()
    }

    findNodeWithId(nodeId) {
        return this.nodes.find(node => node.id == nodeId)
    }
}


class App {
    static async fromId(appId) {
        const app = new App(appId)
        await app.load()
        return app
    }

    constructor(id) {
        this.id = id
    }

    get ref() {
        return db.doc(`apps/${this.id}`)
    }

    async load() {
        const appDoc = await this.ref.get()

        if (!appDoc.exists)
            throw new Error(`App with ID ${this.id} doesn't exist`)

        Object.entries(appDoc.data())
            .forEach(([key, val]) => this[key] = val)
    }

    update(data) {
        return this.ref.update(data)
    }
}
