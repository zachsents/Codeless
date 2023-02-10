import functions from "firebase-functions"
import { oauthClient, db } from "./init.js"
import { google } from "googleapis"
import { httpsCallable, url } from "firebase-admin-callable-functions"
import { logger } from "./logger.js"
import { RunStatus } from "./flows.js"


export const handleMessage = functions.pubsub.topic("gmail").onPublish(async (message, context) => {

    logger.setPrefix("Gmail")

    if (!message.data)
        throw new Error("No message data in PubSub message from Gmail topic")

    // parse out PubSub message data
    const { emailAddress, historyId: newHistoryId } = JSON.parse(
        Buffer.from(message.data, 'base64').toString()
    )

    logger.log(`Received event for ${emailAddress} (History ID: ${newHistoryId})`)

    // query for flows involving this email address
    const querySnapshot = await db.collection("flows")
        .where("gmailTriggerEmailAddress", "==", emailAddress)
        .where("published", "==", true)
        .get()

    // make a map of app -> flows
    const appMap = querySnapshot.docs.reduce((map, doc) => {
        const appId = doc.data().app

        map[appId] ??= { flows: [], newHistoryId, appId }
        map[appId].flows.push(doc.id)
        return map
    }, {})

    logger.log(`Handling event for ${Object.keys(appMap).length} apps.`)

    // fan out by app -- calling runFlowsForApp for each one
    // doing this so we can asynchronously authorize a bunch of Gmail APIs
    await Promise.all(
        Object.keys(appMap).map(
            appId => httpsCallable(url("gmail-runFlowsForApp"))(appMap[appId])
        )
    )
})


export const runFlowsForApp = functions.https.onCall(async ({ appId, flows, newHistoryId }, context) => {

    logger.setPrefix("Gmail")
    logger.log(`Trying ${flows.length} flow(s) for app: ${appId}`)

    // get Gmail API
    const gmail = await getGmailApi(appId)

    // loop through flows
    const flowPromises = flows.map(async flowId => {

        /**
         * Fetch and update flow's history ID -- it's important this happens
         * in a transaction so we don't get repeat messages.
         */
        const flowDocRef = db.doc(`flows/${flowId}`)
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

        logger.log(`Found ${messageIds.length} messages added in history. (Flow ID: ${flowId})`)

        // loop through message IDs
        let messagesLoaded = 0
        await Promise.all(
            messageIds.map(async messageId => {

                // fetch message details
                try {
                    var { data: message } = await gmail.users.messages.get({
                        userId: "me",
                        id: messageId,
                    })
                }
                catch (err) {
                    logger.log(`[Flow-${flowId}] (${++messagesLoaded} / ${messageIds.length}) Unable to get message: ${messageId}`)
                    return
                }

                logger.log(`[Flow-${flowId}] (${++messagesLoaded} / ${messageIds.length}) Got details for message: ${messageId}`)

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

                // add flow run
                await db.collection("flowRuns").add({
                    flow: flowId,
                    payload: flowPayload,
                    status: RunStatus.Pending,
                    source: "gmail",
                })
            })
        )
    })

    await Promise.all(flowPromises)
})


export const refreshWatches = functions.pubsub.schedule("0 11 * * *").onRun(async (context) => {

    // get published flows with Gmail trigger
    const querySnapshot = await db.collection("flows")
        .where("trigger", "==", "gmail:EmailReceivedTrigger")
        .where("published", "==", true)
        .get()

    // map to unique app IDs
    const appIds = [...new Set(
        querySnapshot.docs.map(doc => doc.app)
    )]

    console.log(`Refreshing Gmail watch for ${appIds.length} apps.`)

    // fan out -- need to do this because we only have the one global OAuth client
    await Promise.all(
        appIds.map(
            appId => httpsCallable(url("gmail-refreshWatch"))({ appId })
        )
    )
})


export const refreshWatch = functions.https.onCall(async (data, context) => {

    // get Gmail API
    const gmail = await getGmailApi(data.appId)

    // refresh watch
    await gmail.users.watch({
        userId: "me",
        labelIds: ["INBOX"],
        labelFilterAction: "include",
        topicName: "projects/nameless-948a8/topics/gmail",
    })

    console.log(`[App-${data.appId}] Refreshed Gmail watch.`)
})


async function getGmailApi(appId) {
    // grab stored refresh token
    const appSnapshot = await db.doc(`apps/${appId}`).get()
    const refreshToken = appSnapshot.data().integrations?.Google?.refreshToken

    // throw error if there's no token
    if (!refreshToken)
        throw new Error(`Gmail is not authorized for app ${appId}.`)

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