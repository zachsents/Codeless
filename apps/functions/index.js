import functions from "firebase-functions"
import admin from "firebase-admin"
import { getFunctions } from "firebase-admin/functions"
import { FieldValue } from "firebase-admin/firestore"
import { executeFlow } from "./execution.js"
import { customAlphabet } from "nanoid"
import nanoidDict from "nanoid-dictionary"
import { oauthClient, db } from "./init.js"

import * as dotenv from "dotenv"
dotenv.config()


export const runWithUrl = functions.https.onRequest(async (request, response) => {

    const [, appId, flowId] = request.path.split("/")

    const result = await run({
        appId,
        flowId,
        payload: {
            method: request.method,
            headers: request.headers,
            body: request.body,
        },
        logOptions: {
            executionMethod: ExecutionMethod.URL,
        },
    })

    if (result.error) {
        response.status(result.status ?? 500).send(result)
        return
    }

    response.status(200).send(result)
})


export const runNow = functions.https.onCall((data, context) => run({ ...data, context }))


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


export const runFromSchedule = functions.tasks.taskQueue().onDispatch(

    ({ appId, flowId, runId, payload }) =>
        run({
            appId,
            flowId,
            payload,
            logOptions: validation => {
                const runItem = validation.data.scheduledRuns.find(run => run.id == runId)
                return {
                    genId: false,
                    executionMethod: ExecutionMethod.Scheduled,
                    additionalRunFields: runItem,
                    additionalUpdateFields: {
                        scheduledRuns: validation.data.scheduledRuns.filter(run => run != runItem),
                    }
                }
            }
        })
)


export const authorizeGoogleApp = functions.https.onCall(async ({ appId, scopes }) => {

    const url = oauthClient.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: appId,
        include_granted_scopes: true,
    })

    return { url }
})


export const googleAppAuthorizationRedirect = functions.https.onRequest(async (request, response) => {

    // create tokens from code
    const { tokens } = await oauthClient.getToken(request.query.code)

    // check granted scopes
    const grantedScopes = (await oauthClient.getTokenInfo(tokens.access_token)).scopes

    // store refresh token & scopes
    const appId = request.query.state
    await db.doc(`apps/${appId}`).update({
        "integrations.Google.refreshToken": tokens.refresh_token,
        "integrations.Google.scopes": grantedScopes,
    })

    console.log(`Succesfully authorized app "${appId}"`)

    // response with JS to close the popup window
    response.send("<script>window.close()</script>")
})


export * as gmail from "./gmail.js"



export async function run({ appId, flowId, payload, context, logOptions, validationOptions }) {

    // Validate
    // const validation = await validateCall(appId, flowId, {
    //     uid: context.auth?.uid,
    // })
    const validation = await validateCall(appId, flowId, validationOptions)

    // Catch validation errors and return early
    if (validation.error)
        return validation

    // Run flow
    try {
        var result = await executeFlow(validation.data.graph, payload, { appId, flowId })
    }
    catch (err) {
        console.error(err)
        return { error: "Encountered an error running this flow.", appId, flowId }
    }

    // Log run
    await logRun(
        validation.docRef,
        result,
        logOptions ?
            (typeof logOptions === "function" ? logOptions(validation) : logOptions) :
            {
                executionMethod: ExecutionMethod.Manual,
            }
    )

    return result ?? { message: "OK!" }
}


function logRun(docRef, result, { genId = true, executionMethod, additionalRunFields = {}, additionalUpdateFields = {} } = {}) {

    // remove fullError field so we can store
    Object.values(result.errors).forEach(errList => errList.forEach(err => delete err.fullError))

    return docRef.update({
        runs: FieldValue.arrayUnion({
            // optionally generate run ID
            ...(genId && { id: generateId() }),

            executedAt: new Date(),
            method: executionMethod,
            ...result,

            ...additionalRunFields,
        }),
        ...additionalUpdateFields,
    })
}


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


export const ExecutionMethod = {
    Manual: "manual",
    Scheduled: "scheduled",
    URL: "url",
    PubSub: "pubsub",
}

const generateId = customAlphabet(nanoidDict.alphanumeric, 20)