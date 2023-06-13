import { getFlowGraphForFlow, getFlowTriggerData, gmail, google, updateFlowTriggerData } from "@minus/server-lib"
import functions from "firebase-functions"
import { db, pubsub } from "./init.js"
import { RunStatus } from "@minus/util"


const HISTORY_UPDATE_FOR_FLOW_TOPIC = "gmail-history-update-for-flow"
const EXCLUDED_LABELS = ["DRAFT", "SENT", "TRASH", "SPAM"]


const withSecret = functions.runWith({
    secrets: [google.googleOAuthClientSecret]
})


export const handleMessage = withSecret.pubsub.topic("gmail").onPublish(async (message) => {

    // Parse out message data
    const { emailAddress, historyId: newHistoryId } = parsePubSubMessage(message)

    // Query for flows involving this email address
    const querySnapshot = await db.collection("triggerData")
        .where("gmailEmailAddress", "==", emailAddress)
        .get()

    console.debug(`Received Gmail event for ${emailAddress}. Fanning out for ${querySnapshot.size} flow(s).`)

    // Loop through involved flows and fan out -- each flow involved will
    // have its own history to deal with
    await Promise.all(
        querySnapshot.docs.map(
            async doc => pubsub.topic(HISTORY_UPDATE_FOR_FLOW_TOPIC).publishJSON({
                flowId: doc.id,
                newHistoryId,
            })
        )
    )
})


export const handleHistoryUpdateForFlow = withSecret.pubsub.topic(HISTORY_UPDATE_FOR_FLOW_TOPIC).onPublish(async (message) => {

    const { flowId, newHistoryId } = parsePubSubMessage(message)

    // Load in flow graph and find trigger
    const flowGraph = await getFlowGraphForFlow(flowId, { parse: true })
    const triggerNode = flowGraph.nodes.find(node => node.id === "trigger")

    // Get Gmail API
    const gmailApi = await google.authManager.getAPI(triggerNode.data.selectedAccounts.google, {
        api: "gmail",
        version: "v1",
    })

    /**
     * Fetch and update flow's old history ID -- it's important this happens
     * in a transaction so we don't get repeat messages.
     */
    const startHistoryId = await db.runTransaction(async transaction => {
        const { gmailHistoryId } = await getFlowTriggerData(flowId, { transaction })

        await updateFlowTriggerData(flowId, {
            gmailHistoryId: Math.max(newHistoryId, gmailHistoryId),
        }, { transaction })

        return gmailHistoryId
    })

    // Fetch history
    const { data: { history } } = await gmailApi.users.history.list({
        userId: "me",
        startHistoryId,
        historyTypes: ["messageAdded"],
    })

    /**
     * Grab all message IDs from history, filtering out any that are drafts,
     * sent mail, trash, spam, etc.
     */
    const messageIds = history
        // this is also important for preventing repeats -- need to make sure we only look within history bounds
        ?.filter(hist => hist.id < Math.max(startHistoryId, newHistoryId))
        .map(
            hist => hist.messagesAdded
                // exclude drafts, sent mail, trash, spam, etc.
                ?.filter(({ message }) =>
                    message.labelIds?.every(label => !EXCLUDED_LABELS.includes(label))
                )
                .map(({ message }) => message.id) ?? []
        )
        .flat() ?? []

    console.debug(`Found ${messageIds.length} messages added in history. (Flow ID: ${flowId})`)

    // Fetch each message and start a flow run for it
    await Promise.all(
        messageIds.map(async messageId => {

            // Fetch message details
            try {
                var messageData = await gmail.getMessage(gmailApi, messageId, {
                    format: "clean",
                })
            }
            catch (err) {
                return
            }

            // Add flow run
            await db.collection("flowRuns").add({
                flow: flowId,
                payload: messageData,
                status: RunStatus.Pending,
                source: "gmail",
            })
        })
    )
})


export const refreshWatches = withSecret.pubsub.schedule("every day 00:00").onRun(async () => {

    // Get triggerData documents with Gmail email attached
    const querySnapshot = await db.collection("triggerData")
        .orderBy("gmailEmailAddress")
        .get()

    // Create a unique set of email addresses
    const emailAddresses = [...new Set(
        querySnapshot.docs.map(doc => doc.data().gmailEmailAddress)
    )]

    console.debug(`Refreshing Gmail watch for ${emailAddresses.length} email addresses.`)

    emailAddresses.map(async emailAddress => {
        // Get Gmail API
        const gmailApi = google.authManager.getAPI(`google:${emailAddress}`, {
            api: "gmail",
            version: "v1",
        })

        // Get trigger data
        const triggerData = querySnapshot.docs.find(doc => doc.data().gmailEmailAddress === emailAddress).data()

        // Refresh watch
        await gmailApi.users.watch({
            userId: "me",
            labelIds: triggerData.gmailLabelIds,
            labelFilterAction: "include",
            topicName: `projects/${process.env.GCLOUD_PROJECT}/topics/gmail`,
        })
    })
})


/**
 * Parses a PubSub message. The data is usually base64-encoded JSON.
 *
 * @param {{ data: string } | string} messageOrData Either a PubSub message object with a data property, or just the data property itself.
 */
function parsePubSubMessage(messageOrData) {
    return JSON.parse(
        Buffer.from(messageOrData.data ?? messageOrData, "base64").toString()
    )
}