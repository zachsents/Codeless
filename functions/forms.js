import { getFlowGraph, google } from "@minus/server-lib"
import functions from "firebase-functions"
import { db } from "./init.js"
import { parsePubSubMessage } from "./util.js"


const withSecret = functions.runWith({
    secrets: [google.googleOAuthClientSecret]
})


export const handleFormSubmissions = functions.pubsub.topic("forms-submit").onPublish(async (message) => {

    // Parse out message data
    const parsed = parsePubSubMessage(message)

    console.log(parsed)

    // WILO: need to figure out the shape of the data coming in from the pubsub message

    // Query for flows involving this email address
    // const querySnapshot = await db.collection("triggerData")
    //     .where("gmailEmailAddress", "==", emailAddress)
    //     .get()

    // console.debug(`Received Gmail event for ${emailAddress}. Fanning out for ${querySnapshot.size} flow(s).`)

    // // Loop through involved flows and fan out -- each flow involved will
    // // have its own history to deal with
    // await Promise.all(
    //     querySnapshot.docs.map(
    //         async doc => pubsub.topic(HISTORY_UPDATE_FOR_FLOW_TOPIC).publishJSON({
    //             flowId: doc.id,
    //             newHistoryId,
    //         })
    //     )
    // )
})


export const refreshWatches = withSecret.pubsub.schedule("every day 00:05").onRun(async () => {

    // Get all published flows with a Google Forms trigger
    const querySnapshot = await db.collection("flows")
        .where("trigger", "==", "googleforms:OnFormSubmission")
        .where("published", "==", true)
        .get()

    const flows = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    console.debug(`Refreshing Google Forms watch for ${flows.length} flows.`)

    flows.map(async flow => {

        // Get flow graph
        const flowGraph = await getFlowGraph(flow.graph, {
            parse: true,
        })

        // Pull connected account and form ID from trigger node
        const triggerNode = flowGraph.nodes.find(node => node.id === "trigger")
        const connectedAccount = triggerNode.data.selectedAccounts.google
        const formId = triggerNode.data.state.formId

        // Authorize Forms API with trigger's connected account
        /** @type {import("googleapis").forms_v1.Forms} */
        const formsApi = google.authManager.getAPI(connectedAccount, {
            api: "forms",
            version: "v1",
        })

        // Refresh watch
        await formsApi.forms.watches.renew({
            formId,
            watchId: flow.id,
        })
    })
})