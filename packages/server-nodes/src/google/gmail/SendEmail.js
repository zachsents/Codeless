import { gmail } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:SendEmail",
    name: "Send Email",

    inputs: ["to", "cc", "subject", "body"],
    outputs: [],

    async onInputsReady({ to, cc, subject, body }) {

        const gmailApi = await gmail.getGmailAPI(global.info.appId)

        await safeMap((to, cc, subject, body) => {
            if(!to || !subject || !body)
                return

            return gmail.sendEmail(gmailApi, { to, cc, subject, plainText: body })
        }, to, cc, subject, body)
    },
}