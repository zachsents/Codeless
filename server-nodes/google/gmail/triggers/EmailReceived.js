import { gmail } from "@minus/server-sdk"


export default {
    id: "gmail:EmailReceivedTrigger",

    inputs: [],

    onStart(setupPayload) {
        // "From" field sometimes looks like this: First Last <email@gmail.com>
        // let's parse it out first
        // eslint-disable-next-line no-unused-vars
        const { from, rawMessage, plainText, ...otherFields } = setupPayload
        const [, fromName, fromEmail] = from.match(/(.+?\s)<(.+?)>/) ?? [, , from]

        // do "smart" conversion of plainText
        const simpleText = plainText
            .replaceAll(/<http.+?>/g, "")   // remove links
            .replaceAll(/\n{3,}/g, "\n\n")  // shrink more than 3 line breaks

        // put message on variable so we can access it in other places
        this.graph.setVariable("_triggerEmail", setupPayload)

        this.publish({ fromName, fromEmail, plainText, simpleText, ...otherFields })
    },

    async onDeploy({ flow }) {
        const gmailApi = await gmail.getGmailAPI(flow.app.id)
        await gmail.watchInbox(gmailApi, { flow })
    },

    async onUndeploy() {

    },
}
