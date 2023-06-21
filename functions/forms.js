import { getFlowGraphForFlow, getFlowTriggerData, google, updateFlowTriggerData } from "@minus/server-lib"
import { RunStatus, asyncMap } from "@minus/util"
import functions from "firebase-functions"
import { db, pubsub } from "./init.js"
import { parsePubSubMessage } from "./util.js"


const HISTORY_UPDATE_FOR_FLOW_TOPIC = "forms-history-update-for-flow"


const withSecret = functions.runWith({
    secrets: [google.googleOAuthClientSecret]
})


export const handleFormSubmissions = functions.pubsub.topic("forms-submit").onPublish(async (message) => {

    // Parse out message data
    const { attributes: { watchId }, publishTime } = parsePubSubMessage(message)

    // Query for flows involving this watch ID
    const querySnapshot = await db.collection("triggerData")
        .where("formsWatchId", "==", watchId)
        .get()

    console.debug(`Received Google Form reponse submission event (Watch ID: ${watchId}). Fanning out for ${querySnapshot.size} flow(s).`)

    // Loop through involved flows and fan out -- each flow involved will
    // have its own history to deal with
    await Promise.all(
        querySnapshot.docs.map(
            async doc => pubsub.topic(HISTORY_UPDATE_FOR_FLOW_TOPIC).publishJSON({
                flowId: doc.id,
                newHistoryId: publishTime,
            })
        )
    )
})


export const handleHistoryUpdateForFlow = withSecret.pubsub.topic(HISTORY_UPDATE_FOR_FLOW_TOPIC).onPublish(async (pubsubMessage) => {

    const { flowId, newHistoryId } = parsePubSubMessage(pubsubMessage)

    // Load in flow graph and find trigger
    const flowGraph = await getFlowGraphForFlow(flowId, { parse: true })
    const triggerNode = flowGraph.nodes.find(node => node.id === "trigger")

    // Get Forms API
    /** @type {import("googleapis").forms_v1.Forms} */
    const formsApi = await google.authManager.getAPI(triggerNode.data.selectedAccounts.google, {
        api: "forms",
        version: "v1",
    })

    /**
     * Fetch and update flow's old history ID -- it's important this happens
     * in a transaction so we don't get repeat messages.
     */
    const { formsHistoryId: startHistoryId, formsFormId } = await db.runTransaction(async transaction => {
        const triggerData = await getFlowTriggerData(flowId, { transaction })

        await updateFlowTriggerData(flowId, {
            formsHistoryId: Math.max(new Date(newHistoryId).getTime(), new Date(triggerData.formsHistoryId).getTime()),
        }, { transaction })

        return triggerData
    })

    // Fetch responses in history
    const { data: { responses } } = await formsApi.forms.responses.list({
        formId: formsFormId,
        filter: `timestamp > ${startHistoryId}`
    })

    // WILO: everything's looking good, just need to fetch questions and put answers in order

    console.debug(`Found ${responses.length} responses added in history. (Flow ID: ${flowId})`)

    // Start a flow run for each message -- in a batched write
    const batch = db.batch()
    responses?.forEach(response => {
        const docRef = db.collection("flowRuns").doc()
        batch.set(docRef, {
            flow: flowId,
            payload: response,
            status: RunStatus.Pending,
            source: "forms",
        })
    })
    await batch.commit()
})


export const refreshWatches = withSecret.pubsub.schedule("every day 00:05").onRun(async () => {

    // Get triggerData documents with watch ID property
    const querySnapshot = await db.collection("triggerData")
        .orderBy("formsWatchId")
        .get()

    // Create a unique set of watch IDs
    const watchIds = [...new Set(
        querySnapshot.docs.map(doc => doc.data().formsWatchId)
    )]

    console.debug(`Renewing Google Forms watches for ${watchIds.length} forms.`)

    // Loop through watch IDs and renew each one
    await asyncMap(watchIds, async watchId => {
        // Get trigger data
        const triggerData = querySnapshot.docs.find(doc => doc.data().formsWatchId === watchId).data()

        // Get Forms API
        /** @type {import("googleapis").forms_v1.Forms} */
        const formsApi = google.authManager.getAPI(triggerData.formsAccount, {
            api: "forms",
            version: "v1",
        })

        // Renew watch
        await formsApi.forms.watches.renew({
            formId: triggerData.formsFormId,
            watchId,
        })
    })
})