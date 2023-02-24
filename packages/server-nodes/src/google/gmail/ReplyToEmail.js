import { VariablePort, gmail } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:ReplyToEmail",
    name: "Reply to Email",

    inputs: ["body"],
    outputs: [],

    onBeforeStart() {
        this.state._triggerEmailPromise = VariablePort.setupPortOnGlobals("_triggerEmail").subscribePromise()
    },

    async onInputsReady({ body }) {

        // await original email from variable port
        const triggerEmail = await this.state._triggerEmailPromise

        // get Gmail API
        const gmailApi = await gmail.getGmailAPI(global.info.appId)

        // send email(s)
        await safeMap((body) => {
            if (!body)
                return

            return gmail.sendEmail(gmailApi, {
                to: triggerEmail.from,
                subject: triggerEmail.subject,
                plainText: body,
            }, {
                threadId: triggerEmail.rawMessage.threadId,
            })
        }, body)
    },
}
