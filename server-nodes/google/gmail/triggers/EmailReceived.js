import { gmail } from "@minus/server-sdk"


export default {
    id: "gmail:EmailReceivedTrigger",

    inputs: [],

    onStart(setupPayload) {
        // put message on variable so we can access it in other places
        this.graph.setVariable("_triggerEmail", setupPayload)

        this.publish(setupPayload)
    },

    async onDeploy({ flow }) {
        const gmailApi = await gmail.getGmailAPI(flow.app.id)
        await gmail.watchInbox(gmailApi, { flow })
    },

    async onUndeploy() {

    },
}
