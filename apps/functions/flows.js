import { FieldValue } from "firebase-admin/firestore"
import { getFunctions } from "firebase-admin/functions"
import functions from "firebase-functions"
import { db } from "./init.js"
import NodeTypes from "@minus/server-nodes"
import { runFlow } from "@minus/gee3"
import { logger } from "./logger.js"


export const runWritten = functions.firestore.document("flowRuns/{flowRunId}").onWrite(async (change) => {

    if (!change.after.exists)
        return

    const run = { id: change.after.id, ...change.after.data() }

    logger.setPrefix(`Flow-${run.flow}`)

    try {
        /**
         * Pending
         */
        if (run.status == RunStatus.Pending || !run.status) {
            const { valid, error } = await _validate(run.flow)

            const status = valid ? RunStatus.Validated : RunStatus.FailedValidation
            await change.after.ref.update({
                status,
                validationError: error ?? null,
                validatedAt: FieldValue.serverTimestamp()
            })

            logger.log(`Finished validation with status: "${status}"`)
            return
        }

        /**
         * Scheduled
         */
        if (run.status == RunStatus.Scheduled) {

            if (!run.scheduledFor)
                throw new Error("Scheduled run doesn't include a time in 'scheduledFor' field")

            await getFunctions().taskQueue("flow-startScheduledRun").enqueue({
                flowRunId: run.id
            }, {
                scheduleTime: new Date(run.scheduledFor.toMillis()),
            })

            logger.log(`Scheduled flow`)
            return
        }

        /**
         * Validated
         */
        if (run.status == RunStatus.Validated) {

            // execute flow
            logger.log(`Beginning flow run ${run.id}`)
            const flow = await Flow.fromId(run.flow)
            global.info = {
                flow,
                flowId: flow.id,
                app: flow.app,
                appId: flow.app.id,
            }
            const { errors, outputs, returns } = await flow.run(run.payload)

            // update doc with run info
            const status = Object.keys(errors).length ? RunStatus.FinishedWithErrors : RunStatus.Finished
            await change.after.ref.update({
                status,
                errors,
                outputs,
                returns,
                ranAt: FieldValue.serverTimestamp(),
            })

            // index the flow's edges if it was successful
            try {
                if (status == RunStatus.Finished)
                    await flow.graph.indexEdges()
            }
            catch (err) {
                console.error(err)
            }

            logger.log(`Finished flow run ${run.id} with status: "${status}"`)
            return
        }
    }
    catch (error) {
        await change.after.ref.update({
            status: RunStatus.Failed,
            failureError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        })
    }
})


export const publish = functions.https.onCall(async (data) => {
    try {
        const flow = await Flow.fromId(data.flowId)

        // run deploy routine for each node
        await Promise.all(
            flow.graph.nodes.map(
                node => NodeTypes[node.type].onDeploy?.bind(node)({
                    flow,
                })
            )
        )

        flow.update({ published: true })
    }
    catch (error) {
        console.error(error)
        return { success: false, error }
    }

    return { success: true }
})


export const unpublish = functions.https.onCall(async (data) => {
    try {
        const flow = await Flow.fromId(data.flowId)

        // run undeploy routine for each node
        await Promise.all(
            flow.graph.nodes.map(
                node => NodeTypes[node.type].onUndeploy?.bind(node)({
                    flow,
                })
            )
        )

        flow.update({ published: false })
    }
    catch (error) {
        console.error(error)
        return { success: false, error }
    }

    return { success: true }
})


export const validate = functions.https.onCall((data) => _validate(data.flowId))


export const startScheduledRun = functions.tasks.taskQueue().onDispatch(async ({ flowRunId }) => {
    await db.doc(`flowRuns/${flowRunId}`).update({ status: RunStatus.Pending })
})


export const runFromUrl = functions.https.onRequest(async (req, res) => {

    const flowId = req.query.flow_id

    // insert run document
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


async function _validate(flowId) {
    try {
        const flow = await Flow.fromId(flowId)

        // run validate routine for each node
        await Promise.all(
            flow.graph.nodes.map(
                node => NodeTypes[node.type].validate?.bind(node)({
                    flow,
                })
            )
        )


    }
    catch (error) {
        console.error(error)
        return { valid: false, error }
    }

    return { valid: true }
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

    run(payload) {
        if (!this.graph?.nodes || !this.graph?.edges)
            throw new Error("This flow's graph isn't loaded properly")

        return runFlow({
            nodes: this.graph.nodes,
            edges: this.graph.edges,
            nodeTypes: NodeTypes,
            setupPayload: payload,
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
            const sourceType = this.findNodeWithId(edge.source).type.id
            const targetType = this.findNodeWithId(edge.target).type.id

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


// class FlowRun {
//     static async fromId(flowRunId, options) {
//         const flowRun = new FlowRun(flowRunId)
//         await flowRun.load(options)
//         return flowRun
//     }

//     constructor(id) {
//         this.id = id
//     }

//     get ref() {
//         return db.doc(`flowRuns/${this.id}`)
//     }

//     async load({
//         includeFlow = true,
//         flowOptions,
//     } = {}) {
//         const flowRunDoc = await this.ref.get()

//         if (!flowRunDoc.exists)
//             throw new Error(`Flow Run with ID ${this.id} doesn't exist`)

//         Object.entries(flowRunDoc.data())
//             .forEach(([key, val]) => this[key] = val)

//         if (includeFlow)
//             this.flow = await Flow.fromId(this.flow, flowOptions)
//     }

//     update(data) {
//         return this.ref.update(data)
//     }
// }


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


export const RunStatus = {
    Pending: "pending",
    Scheduled: "scheduled",
    Validated: "validated",
    FailedValidation: "failed-validation",
    Finished: "finished",
    FinishedWithErrors: "finished-with-errors",
    Failed: "failed",
}