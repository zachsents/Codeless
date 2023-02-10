import functions from "firebase-functions"
import { oauthClient, db } from "./init.js"
import { google } from "googleapis"
import { httpsCallable, url } from "firebase-admin-callable-functions"


export const handleGmailMessage = functions.pubsub.topic("gmail").onPublish(async (message, context) => {

    if (!message.data) {
        console.error("No message data. Quitting")
        return
    }

    // parse out pubsub message data
    const { emailAddress, historyId: newHistoryId } = JSON.parse(
        Buffer.from(message.data, 'base64').toString()
    )

    console.debug(`Received Gmail Event: ${emailAddress}, ${newHistoryId}`)

    // query for flows involving this email address
    const querySnapshot = await db.collectionGroup("flows")
        .where("gmailTriggerEmailAddress", "==", emailAddress)
        .where("published", "==", true)
        .get()

    // make a map of app -> flows
    const appMap = querySnapshot.docs.reduce((map, doc) => {
        const appId = doc.ref.parent.parent.id

        map[appId] ??= { flows: [], newHistoryId, appId }
        map[appId].flows.push(doc.id)
        return map
    }, {})

    // fan out by app -- calling runGmailFlowsForApp for each one
    // doing this so we can asynchronously authorize a bunch of Gmail APIs
    Object.keys(appMap).forEach(appId => {
        httpsCallable(url("gmail-runGmailFlowsForApp", {
            projectId: global.admin.app().options.projectId,
            local: process.env.FUNCTIONS_EMULATOR,
        }))(appMap[appId])
    })
})


export const runGmailFlowsForApp = functions.https.onCall(async ({ appId, flows, newHistoryId }, context) => {
    console.debug(`Running ${flows.length} flow(s) for app:`, appId)

    // get Gmail API
    const gmail = await getGmailApi(appId)

    // loop through flows
    const flowPromises = flows.map(async flowId => {

        /**
         * Fetch and update flow's history ID -- it's important this happens
         * in a transaction so we don't get repeat messages.
         */
        const flowDocRef = db.doc(`apps/${appId}/flows/${flowId}`)
        const startHistoryId = await db.runTransaction(async t => {
            // grab history ID
            const doc = await t.get(flowDocRef)
            const historyId = doc.data().gmailTriggerHistoryId

            // set new history ID
            await t.update(flowDocRef, {
                gmailTriggerHistoryId: Math.max(newHistoryId, historyId),
            })

            return historyId
        })

        console.log(`Getting history between ${startHistoryId} and ${newHistoryId}`)

        // fetch history
        const { data: { history } } = await gmail.users.history.list({
            userId: "me",
            startHistoryId,
            historyTypes: ["messageAdded"],
        })

        // grab all message IDs for messages added
        const messageIds = history
            // this is also important for preventing repeats -- need to make sure we only look within history bounds
            ?.filter(hist => hist.id < Math.max(startHistoryId, newHistoryId))
            .map(
                hist => hist.messagesAdded
                    // exclude drafts & sent mail
                    ?.filter(({ message }) => !message.labelIds?.includes("DRAFT") && !message.labelIds?.includes("SENT"))
                    .map(({ message }) => message.id) ?? []
            )
            .flat() ?? []

        console.debug(`[${flowId}] Found ${messageIds.length} messages added in history.`)

        // loop through message IDs
        await Promise.all(
            messageIds.map(async (messageId, i) => {

                // fetch message details
                try {
                    var { data: message } = await gmail.users.messages.get({
                        userId: "me",
                        id: messageId,
                    })
                }
                catch (err) {
                    console.debug(`[${flowId}] (${i + 1} / ${messageIds.length}) Unable to get message: ${messageId}`)
                }

                console.debug(`[${flowId}] (${i + 1} / ${messageIds.length}) Got details for message: ${messageId}`)

                // pull out the data we want to pass to the flow
                const flowPayload = {
                    id: message.id,
                    from: getHeader("From", message.payload),
                    replyTo: getHeader("Reply-To", message.payload),
                    subject: getHeader("Subject", message.payload),
                    date: getHeader("Date", message.payload),
                    plainText: decodeEmailBody(
                        message.payload.body.data ??
                        message.payload.parts?.find(part => part.mimeType == "text/plain")?.body.data ?? ""
                    ),
                    html: decodeEmailBody(
                        message.payload.parts?.find(part => part.mimeType == "text/html")?.body.data ?? ""
                    ),
                    snippet: message.snippet,
                }

                // run flow
                // await run({
                //     appId,
                //     flowId,
                //     payload: flowPayload,
                //     logOptions: {
                //         // executionMethod: ExecutionMethod.PubSub,
                //     }
                // })
            })
        )
    })

    await Promise.all(flowPromises)
})


export const refreshWatch = functions.pubsub.schedule("0 11 * * *").onRun(async (context) => {
    // export const refreshWatch = functions.https.onRequest(async (req, res) => {
    //     res.send({})

    // get flows with Gmail trigger
    const querySnapshot = await db.collectionGroup("flows")
        .where("trigger", "==", "gmail:EmailReceivedTrigger")
        // .where("published", "==", true)
        .get()

    // map to unique app IDs
    const appIds = [...new Set(
        querySnapshot.docs.map(doc => doc.ref.parent.parent.id)
    )]

    console.log(`Refreshing Gmail watch for ${appIds.length} apps.`)

    // loop through app IDs
    for (let appId of appIds) {
        // get Gmail API
        const gmail = await getGmailApi(appId)

        // refresh watch
        await gmail.users.watch({
            userId: "me",
            labelIds: ["INBOX"],
            labelFilterAction: "include",
            topicName: "projects/nameless-948a8/topics/gmail",
        })
    }
})


async function getGmailApi(appId) {
    // grab stored refresh token
    const appSnapshot = await db.doc(`apps/${appId}`).get()
    const refreshToken = appSnapshot.data().integrations?.Google?.refreshToken

    // throw error if there's no token
    if (!refreshToken)
        return { error: "Gmail is not authorized." }

    // authorize OAuth2 client with stored token
    oauthClient.setCredentials({
        refresh_token: refreshToken,
    })

    return google.gmail({ version: "v1", auth: oauthClient })
}


function getHeader(name, payload) {
    return payload.headers.find(h => h.name == name)?.value
}

function decodeEmailBody(data) {
    return Buffer.from(
        data,
        "base64"
    ).toString()
}