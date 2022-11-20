import functions from "firebase-functions"
import admin from "firebase-admin"
import { executeFlow } from "./execution.js"
import { Trigger } from "triggers"


admin.initializeApp()
const db = admin.firestore()

/**
 *  HTTP Trigger Flows
 */
export const trigger = functions.https.onRequest(async (request, response) => {

    const [, appId, flowId] = request.path.split("/")

    // make sure appId and flowId were included
    if (!appId || !flowId) {
        response.status(400).send({ error: "Must include an app ID and flow ID." })
        return
    }

    // TO DO: sanitize appId and flowId
    const flowDoc = await db.doc(`apps/${appId}/flows/${flowId}`).get()

    // make sure document exists
    if (!flowDoc.exists) {
        response.status(404).send({ error: "That flow doesn't exist.", appId, flowId })
        return
    }

    const flowData = flowDoc.data()

    // make sure flow is deloyed
    if (!flowData.deployed) {
        response.status(503).send({ error: "This flow isn't deployed.", appId, flowId })
        return
    }

    // make sure flow is correct trigger type
    if (flowData.trigger != Trigger.HTTP) {
        response.status(503).send({ error: "This flow cannot be triggered via HTTP.", appId, flowId })
        return
    }

    // run flow
    try {
        executeFlow(flowData.graph)
    }
    catch (error) {
        console.log(error)
        response.status(500).send({ error: "Encountered an error running this flow.", appId, flowId })
        return
    }

    response.send({ message: "OK!" })
})


export const callable = functions.https.onCall(async (data, context) => {

    const { appId, flowId } = data

    // make sure appId and flowId were included
    if (!appId || !flowId)
        return { error: "Must include an app ID and flow ID." }

    // TO DO: sanitize appId and flowId
    const appDoc = await db.doc(`apps/${appId}`).get()
    
    // authenticate user
    if(context.auth.uid != appDoc.data().owner)
        return { error: "You are not authorized to run this flow." }
    
    const flowDoc = await db.doc(`apps/${appId}/flows/${flowId}`).get()
    
    // make sure document exists
    if (!flowDoc.exists)
        return { error: "That flow doesn't exist.", appId, flowId }

    const flowData = flowDoc.data()

    // make sure flow is deloyed
    if (!flowData.deployed)
        return { error: "This flow isn't deployed.", appId, flowId }

    // make sure flow is correct trigger type
    if (flowData.trigger != Trigger.Manual)
        return { error: "This flow cannot be triggered via HTTP.", appId, flowId }

    // run flow
    try {
        executeFlow(flowData.graph)
    }
    catch (err) {
        return { error: "Encountered an error running this flow.", appId, flowId }
    }

    return { message: "OK!" }
})