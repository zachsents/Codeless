import { gmail } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:SendEmail",

    inputs: ["to", "cc", "subject", "bodyPlainText", "bodyHTML"],

    async onInputsReady({ to, cc, subject, bodyPlainText, bodyHTML }) {

        const gmailApi = await gmail.getGmailAPI(global.info.appId)

        await safeMap((to, cc, subject, bodyPlainText, bodyHTML) => {
            if (!to || !subject || (!bodyPlainText && !bodyHTML))
                return

            return gmail.sendEmail(gmailApi, {
                to,
                cc,
                subject,
                plainText: bodyPlainText || undefined,
                html: bodyHTML || undefined,
            })
        }, to, cc, subject, bodyPlainText, bodyHTML)
    },
}