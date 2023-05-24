import { RunStatus, getFlowGraphForFlow, getFlowTriggerData, gmail, google, updateFlowTriggerData } from "@minus/server-lib"
import { onMessagePublished } from "firebase-functions/v2/pubsub"
import { onSchedule } from "firebase-functions/v2/scheduler"
import { db, pubsub } from "./init.js"


const HISTORY_UPDATE_FOR_FLOW_TOPIC = "gmail-history-update-for-flow"
const EXCLUDED_LABELS = ["DRAFT", "SENT", "TRASH", "SPAM"]


export const handleMessage = onMessagePublished("gmail", async (message) => {

    if (!message.data)
        throw new Error("No message data in PubSub message from Gmail topic")

    // Parse out message data
    const { emailAddress, historyId: newHistoryId } = JSON.parse(
        Buffer.from(message.data, 'base64').toString()
    )

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


export const handleHistoryUpdateForFlow = onMessagePublished(HISTORY_UPDATE_FOR_FLOW_TOPIC, async ({ flowId, newHistoryId }) => {

    // Load in flow graph and find trigger
    const flowGraph = await getFlowGraphForFlow(flowId, { parse: true })
    const triggerNode = flowGraph.nodes.find(node => node.id === "trigger")

    // Get Gmail API
    const gmailApi = await google.getGoogleAPIFromNode(triggerNode, "gmail", "v1")

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


export const refreshWatches = onSchedule("every day 00:00", async () => {

    // Get triggerData documents with Gmail email attached
    const querySnapshot = await db.collection("triggerData")
        .orderBy("gmailEmailAddress")
        .get()

    // Create a unique set of email addresses
    const emailAddresses = [...new Set(
        querySnapshot.docs.map(doc => doc.gmailEmailAddress)
    )]

    console.log(`Refreshing Gmail watch for ${emailAddresses.length} email addresses.`)

    emailAddresses.map(async emailAddress => {
        // Get Gmail API
        const gmailApi = google.authManager.getAPI(`google:${emailAddress}`, {
            api: "gmail",
            version: "v1",
        })

        // Refresh watch
        await gmailApi.users.watch({
            userId: "me",
            labelIds: ["INBOX"],
            labelFilterAction: "include",
            topicName: `projects/${process.env.GCLOUD_PROJECT}/topics/gmail`,
        })
    })
})
