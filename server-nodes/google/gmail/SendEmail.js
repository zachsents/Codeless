import { gmail, google } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:SendEmail",

    inputs: ["to", "cc", "subject", "bodyPlainText", "bodyHTML", "attachment"],

    async onInputsReady({ to, cc, subject, bodyPlainText, bodyHTML, attachment }) {

        const gmailApi = await google.getGoogleAPIFromNode(this, "gmail", "v1")

        await safeMap((to, cc, subject, bodyPlainText, bodyHTML, attachment) => {
            if (!to || !subject || (!bodyPlainText && !bodyHTML))
                return

            return gmail.sendEmail(gmailApi, {
                to,
                cc,
                subject,
                plainText: bodyPlainText || undefined,
                html: bodyHTML || undefined,
                attachments: attachment ? [attachment] : [],
            })
        }, to, cc, subject, bodyPlainText, bodyHTML, attachment)
    },
}