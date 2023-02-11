import { FieldValue } from "firebase-admin/firestore"
import { getFunctions } from "firebase-admin/functions"
import functions from "firebase-functions"
import { db, oauthClient } from "./init.js"
import NodeTypes from "@minus/server-nodes"
import { runFlow } from "@minus/gee3"
import { logger } from "./logger.js"


export const runWritten = functions.firestore.document("flowRuns/{flowRunId}").onWrite(async (change, context) => {

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
            const result = await flow.run(run.payload)

            // update doc with run info
            const status = Object.keys(result.errors).length ? RunStatus.FinishedWithErrors : RunStatus.Finished
            change.after.ref.update({
                status,
                ...result,
                ranAt: FieldValue.serverTimestamp(),
            })

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


export const publish = functions.https.onCall(async (data, context) => {
    try {
        const flow = await Flow.fromId(data.flowId)

        // run deploy routine for each node
        await Promise.all(
            flow.graph.nodes.map(
                node => NodeTypes[node.type].onDeploy?.bind(node)({
                    flow,
                    googleOAuthClient: oauthClient,
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


export const unpublish = functions.https.onCall(async (data, context) => {
    try {
        const flow = await Flow.fromId(data.flowId)

        // run undeploy routine for each node
        await Promise.all(
            flow.graph.nodes.map(
                node => NodeTypes[node.type].onUndeploy?.bind(node)({
                    flow,
                    googleOAuthClient: oauthClient,
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


export const validate = functions.https.onCall((data, context) => _validate(data.flowId))


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


export const flowGraphWritten = functions.firestore.document("flowGraphs/{flowGraphId}").onWrite(async (change, context) => {

    if (!change.after.exists)
        return

    // query for flow
    const querySnapshot = await db.collection("flows").where("graph", "==", context.params.flowGraphId).get()
    
    // loop and update timestamp -- should only be 1, but just to be thorough
    await Promise.all(
        querySnapshot.docs.map(
            flowDoc => flowDoc.ref.update({ lastEdited: FieldValue.serverTimestamp() })
        )
    )
})


async function _validate(flowId) {
    try {
        const flow = await Flow.fromId(flowId)

        // run validate routine for each node
        await Promise.all(
            flow.graph.nodes.map(
                node => NodeTypes[node.type].validate?.bind(node)({
                    flow,
                    googleOAuthClient: oauthClient,
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