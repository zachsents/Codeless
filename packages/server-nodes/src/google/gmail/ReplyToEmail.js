import { gmail } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:ReplyToEmail",
    name: "Reply to Email",

    inputs: ["body"],
    outputs: [],

    onBeforeStart() {
        this.state._triggerEmailPromise = this.graph.subscribeToVariable("_triggerEmail", true)
    },

    async onInputsReady({ body }) {

        // await original email from variable port
        const triggerEmail = await this.state._triggerEmailPromise

        // get Gmail API
        const gmailApi = await gmail.getGmailAPI(global.info.appId)

        // create References string
        const references = triggerEmail.rawMessage.payload.headers.find(header => header.name == "References")?.value ?? ""
            + ` <${triggerEmail.rawMessage.id}>`

        // send email(s)
        await safeMap((body) => {
            if (!body)
                return

            return gmail.sendEmail(gmailApi, {
                to: triggerEmail.from,
                subject: triggerEmail.subject,
                plainText: body,

                // need these headers to make the reply RFC 2822 compliant
                headers: [
                    ["In-Reply-To", `<${triggerEmail.rawMessage.id}>`],
                    ["References", references]
                ]
            }, {
                threadId: triggerEmail.rawMessage.threadId,
            })
        }, body)
    },
}
