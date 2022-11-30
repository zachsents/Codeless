import functions from "firebase-functions"
import admin from "firebase-admin"
import { getFunctions } from "firebase-admin/functions"
import { FieldValue } from "firebase-admin/firestore"
import { executeFlow } from "./execution.js"
import { Trigger } from "triggers"
import { customAlphabet } from "nanoid"
import nanoidDict from "nanoid-dictionary"


admin.initializeApp()
global.admin = admin
const db = admin.firestore()


export const runWithUrl = functions.https.onRequest(async (request, response) => {

    const [, appId, flowId] = request.path.split("/")

    // Validate
    const validation = await validateCall(appId, flowId, {
        matchTrigger: Trigger.HTTP,
    })

    // Catch validation errors and return early
    if (validation.error) {
        response.status(validation.status).send(validation)
        return
    }

    // Run flow
    try {
        executeFlow(validation.data.graph, request, { appId, flowId })
    }
    catch (error) {
        console.error(error)
        response.status(500).send({ error: "Encountered an error running this flow.", appId, flowId })
        return
    }

    // Log run
    await validation.docRef.update({
        runs: FieldValue.arrayUnion({
            id: generateId(),
            executedAt: new Date(),
            method: ExecutionMethod.URL,
        }),
    })

    response.send({ message: "OK!" })
})


export const runNow = functions.https.onCall(async ({ appId, flowId, payload }, context) => {

    // Validate
    // const validation = await validateCall(appId, flowId, {
    //     uid: context.auth?.uid,
    // })
    const validation = await validateCall(appId, flowId)

    // Catch validation errors and return early
    if (validation.error)
        return validation

    // Run flow
    try {
        executeFlow(validation.data.graph, payload, { appId, flowId })
    }
    catch (err) {
        console.error(err)
        return { error: "Encountered an error running this flow.", appId, flowId }
    }

    // Log run
    await validation.docRef.update({
        runs: FieldValue.arrayUnion({
            id: generateId(),
            executedAt: new Date(),
            method: ExecutionMethod.Manual,
        }),
    })

    return { message: "OK!" }
})


export const runLater = functions.https.onCall(async ({ appId, flowId, time, payload }, context) => {

    // Make sure time is attached
    if (time == null)
        return { error: "Must include a schedule time." }

    // Validate
    // const validation = await validateCall(appId, flowId, {
    //     uid: context.auth?.uid,
    // })
    const validation = await validateCall(appId, flowId)

    // Catch validation errors and return early
    if (validation.error)
        return validation

    // Queue function
    const runId = generateId()
    await getFunctions().taskQueue("runFromSchedule").enqueue({
        appId,
        flowId,
        runId,
        payload,
    }, {
        scheduleTime: new Date(time),
    })

    // Add run to list of scheduled runs in database
    await db.doc(`apps/${appId}/flows/${flowId}`).update({
        scheduledRuns: FieldValue.arrayUnion({
            id: runId,
            scheduledFor: new Date(time),
            scheduledAt: new Date(),
        })
    })

    return {
        message: `Success! Scheduled for ${new Date(time).toLocaleString()}`
    }
})


export const runFromSchedule = functions.tasks.taskQueue().onDispatch(async ({ appId, flowId, runId, payload }) => {

    // Validate
    const validation = await validateCall(appId, flowId)

    // Catch validation errors and return early
    if (validation.error)
        return validation

    // Run flow
    try {
        executeFlow(validation.data.graph, payload, { appId, flowId })
    }
    catch (err) {
        console.error(err)
        return { error: "Encountered an error running this flow.", appId, flowId }
    }

    // Log run
    const runItem = validation.data.scheduledRuns.find(run => run.id == runId)

    await validation.docRef.update({
        scheduledRuns: validation.data.scheduledRuns.filter(run => run != runItem),
        runs: FieldValue.arrayUnion({ 
            ...runItem, 
            executedAt: new Date(), 
            method: ExecutionMethod.Scheduled,
        }),
    })

    return { message: "OK!" }
})


async function validateCall(appId, flowId, { uid, matchTrigger } = {}) {

    // Make sure appId and flowId were included
    if (!appId || !flowId)
        return { error: "Must include an app ID and flow ID.", status: 400 }

    // TO DO: sanitize appId and flowId

    // Optional: Authenticate user
    if (uid) {
        const appDoc = await db.doc(`apps/${appId}`).get()

        if (uid != appDoc.data().owner)
            return { error: "You are not authorized to run this flow." }
    }

    const flowDocRef = db.doc(`apps/${appId}/flows/${flowId}`)
    const flowDoc = await flowDocRef.get()

    // Make sure document exists
    if (!flowDoc.exists)
        return { error: "That flow doesn't exist.", appId, flowId, status: 403 }

    const flowData = flowDoc.data()

    // Make sure flow is deloyed
    if (!flowData.deployed)
        return { error: "This flow isn't deployed.", appId, flowId, status: 503 }

    // Optional: Make sure flow is correct trigger type
    if (matchTrigger && flowData.trigger != matchTrigger)
        return { error: "This flow cannot be triggered via HTTP.", appId, flowId, status: 503 }

    // All good!
    return { data: flowData, docRef: flowDocRef }
}


const ExecutionMethod = {
    Manual: "manual",
    Scheduled: "scheduled",
    URL: "url",
}

const generateId = customAlphabet(nanoidDict.alphanumeric, 20)