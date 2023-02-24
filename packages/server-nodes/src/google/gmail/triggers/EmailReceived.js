import { gmail, VariablePort } from "@minus/server-sdk"


export default {
    id: "gmail:EmailReceivedTrigger",
    name: "Gmail Received Email",

    inputs: [],
    outputs: ["fromName", "fromEmail", "subject", "date", "plainText", "html"],

    onStart(setupPayload) {
        // "From" field sometimes looks like this: First Last <email@gmail.com>
        // let's parse it out first
        // eslint-disable-next-line no-unused-vars
        const { from, rawMessage, ...otherFields } = setupPayload
        const [, fromName, fromEmail] = from.match(/(.+?\s)<(.+?)>/) ?? [, , from]

        // put message on port so we can access it in other places
        VariablePort.publish("_triggerEmail", setupPayload)

        this.publish({ fromName, fromEmail, ...otherFields })
    },

    async onDeploy({ flow }) {
        const gmailApi = await gmail.getGmailAPI(flow.app.id)
        await gmail.watchInbox(gmailApi, { flow })
    },

    async onUndeploy() {

    },
}
