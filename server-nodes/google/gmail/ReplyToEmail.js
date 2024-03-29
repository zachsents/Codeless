import { google, gmail } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:ReplyToEmail",

    inputs: ["bodyPlainText", "bodyHTML", "attachment"],

    onBeforeStart() {
        this.state._triggerEmailPromise = this.graph.subscribeToVariable("_triggerEmail", true)
    },

    async onInputsReady({ bodyPlainText, bodyHTML, attachment }) {

        // await original email from variable port
        const triggerEmail = await this.state._triggerEmailPromise

        // get Gmail API
        const gmailApi = await google.getGoogleAPIFromNode(this, "gmail", "v1")

        // get Message-ID header
        const messageIdHeader = triggerEmail.rawMessage.payload.headers.find(header => header.name == "Message-ID")?.value ?? ""

        // create References string
        const references = (triggerEmail.rawMessage.payload.headers.find(header => header.name == "References")?.value ?? "")
            + ` ${messageIdHeader}`

        // send email(s)
        await safeMap((bodyPlainText, bodyHTML, attachment) => {
            if (!bodyPlainText && !bodyHTML)
                return

            return gmail.sendEmail(gmailApi, {
                to: triggerEmail.from,
                subject: `Re: ${triggerEmail.subject}`,

                plainText: bodyPlainText || undefined,
                html: bodyHTML || undefined,
                attachments: attachment ? [attachment] : [],

                // need these headers to make the reply RFC 2822 compliant
                headers: [
                    ["In-Reply-To", messageIdHeader],
                    ["References", references]
                ],
            }, {
                threadId: triggerEmail.rawMessage.threadId,
            })
        }, bodyPlainText, bodyHTML, attachment)
    },
}
