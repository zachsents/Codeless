import { gmail, google } from "@minus/server-lib"


export default {
    id: "gmail:EmailReceivedTrigger",

    inputs: [],

    onStart(setupPayload) {
        // put message on variable so we can access it in other places
        this.graph.setVariable("_triggerEmail", setupPayload)

        this.publish(setupPayload)
    },

    async onDeploy({ flow }) {
        const gmailApi = await google.authManager.getAPI(this.data.selectedAccounts.google, {
            api: "gmail",
            version: "v1",
        })
        await gmail.watchInbox(gmailApi, { flow })
    },

    async onUndeploy({ flow }) {
        await gmail.unwatchInbox(null, { flow })
    },
}
