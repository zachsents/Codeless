import functions from "firebase-functions"
import { db } from "./init.js"
import { httpsCallable, url } from "firebase-admin-callable-functions"
import { RunStatus, gmail, logger } from "@minus/server-sdk"


const EXCLUDED_LABELS = ["DRAFT", "SENT", "TRASH", "SPAM"]


export const handleMessage = functions.pubsub.topic("gmail").onPublish(async (message) => {

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
        .where("triggerData_gmailEmailAddress", "==", emailAddress)
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

    logger.done()
})


export const runFlowsForApp = functions.https.onCall(async ({ appId, flows, newHistoryId }) => {

    console.debug(`Trying ${flows.length} flow(s) for app: ${appId}`)

    // get Gmail API
    const gmailApi = await gmail.getGmailAPI(appId)

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
            const historyId = doc.data().triggerData_gmailHistoryId

            // set new history ID
            await t.update(flowDocRef, {
                "triggerData_gmailHistoryId": Math.max(newHistoryId, historyId),
            })

            return historyId
        })

        console.debug(`Getting history between ${startHistoryId} and ${newHistoryId}`)

        // fetch history
        const { data: { history } } = await gmailApi.users.history.list({
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
                    // exclude drafts, sent mail, trash, spam, etc.
                    ?.filter(({ message }) =>
                        !message.labelIds?.some(label => EXCLUDED_LABELS.includes(label))
                    )
                    .map(({ message }) => message.id) ?? []
            )
            .flat() ?? []

        console.debug(`Found ${messageIds.length} messages added in history. (Flow ID: ${flowId})`)

        // loop through message IDs
        let messagesLoaded = 0
        await Promise.all(
            messageIds.map(async messageId => {

                // fetch message details
                try {
                    var messageData = await gmail.getMessage(gmailApi, messageId, {
                        format: "clean",
                        asFirestoreDate: true,
                    })
                }
                catch (err) {
                    console.debug(`[Flow-${flowId}] (${++messagesLoaded} / ${messageIds.length}) Unable to get message: ${messageId}`)
                    return
                }

                console.debug(`[Flow-${flowId}] (${++messagesLoaded} / ${messageIds.length}) Got details for message: ${messageId}`)

                // add flow run
                await db.collection("flowRuns").add({
                    flow: flowId,
                    payload: messageData,
                    status: RunStatus.Pending,
                    source: "gmail",
                })
            })
        )
    })

    await Promise.all(flowPromises)
})


export const refreshWatches = functions.pubsub.schedule("0 11 * * *").onRun(async () => {

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


export const refreshWatch = functions.https.onCall(async (data) => {

    // get Gmail API
    const gmailApi = await gmail.getGmailAPI(data.appId)

    // refresh watch
    await gmailApi.users.watch({
        userId: "me",
        labelIds: ["INBOX"],
        labelFilterAction: "include",
        topicName: `projects/${process.env.GCLOUD_PROJECT}/topics/gmail`,
    })

    console.log(`[App-${data.appId}] Refreshed Gmail watch.`)
})


function getHeader(name, payload) {
    return payload.headers.find(h => h.name == name)?.value
}


function decodeEmailBody(data) {
    return Buffer.from(
        data,
        "base64"
    ).toString()
}