import { getFlowGraphForFlow, getFlowTriggerData, gmail, google, updateFlowTriggerData } from "@minus/server-lib"
import { RunStatus, asyncMap, asyncMapFilterBlanks } from "@minus/util"
import functions from "firebase-functions"
import { db, pubsub } from "./init.js"
import { parsePubSubMessage } from "./util.js"


const HISTORY_UPDATE_FOR_FLOW_TOPIC = "gmail-history-update-for-flow"
const EXCLUDED_LABELS = ["DRAFT", "TRASH", "SPAM"]


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


export const handleHistoryUpdateForFlow = withSecret.pubsub.topic(HISTORY_UPDATE_FOR_FLOW_TOPIC).onPublish(async (pubsubMessage) => {

    const { flowId, newHistoryId } = parsePubSubMessage(pubsubMessage)

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

    // Grab all the message IDs (excluding certain labels) from the history
    const messageIds = history
        // This is important for preventing repeats -- need to make sure we only look within history bounds
        ?.filter(historyEntry => historyEntry.id < Math.max(startHistoryId, newHistoryId))
        .flatMap(historyEntry => historyEntry.messagesAdded
            // Exclude drafts, trash, spam, etc.
            ?.filter(({ message }) => message.labelIds?.every(label => !EXCLUDED_LABELS.includes(label)))
            .map(({ message }) => message.id) ?? []
        ) ?? []

    // Fetch message details for each message ID
    let messages = await asyncMapFilterBlanks(messageIds, async messageId => {
        try {
            return await gmail.getMessage(gmailApi, messageId, {
                format: "clean",
            })
        }
        catch (err) {
            console.error(`Error fetching message ${messageId} for flow ${flowId}: ${err.message}`)
        }
    })

    // Get the email address from the flow's trigger data
    const { gmailEmailAddress } = await getFlowTriggerData(flowId)

    // Filter out messages that don't have us as the recipient
    messages = messages.filter(messageData => messageData.recipientEmailAddress == gmailEmailAddress)

    console.debug(`Found ${messages.length} messages added in history. (Flow ID: ${flowId})`)

    // Start a flow run for each message -- in a batched write
    const batch = db.batch()
    messages.forEach(messageData => {
        const docRef = db.collection("flowRuns").doc()
        batch.set(docRef, {
            flow: flowId,
            payload: messageData,
            status: RunStatus.Pending,
            source: "gmail",
        })
    })
    await batch.commit()
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

    await asyncMap(emailAddresses, async emailAddress => {
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


