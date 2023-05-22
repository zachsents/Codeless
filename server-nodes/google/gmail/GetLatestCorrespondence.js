import { gmail } from "@minus/server-lib"
import { safeMap, zipObjects } from "../../arrayUtilities.js"


export default {
    id: "gmail:GetLatestCorrespondence",

    inputs: ["emailAddress", "includeSelf"],

    async onInputsReady({ emailAddress, includeSelf }) {

        const gmailApi = await gmail.getGmailAPI(global.info.appId)

        const result = await safeMap(async (emailAddress, includeSelf) => {

            if (!emailAddress)
                return

            // query for latest email
            const { data } = await gmailApi.users.messages.list({
                userId: "me",
                q: `from:${emailAddress}` + (includeSelf ? ` OR to:${emailAddress}` : ""),
                maxResults: 1,
                includeSpamTrash: true,
            })

            const messageId = data.messages?.[0]?.id
            if (!messageId)
                return

            // fetch message
            return gmail.getMessage(gmailApi, messageId)
        }, emailAddress, includeSelf)

        this.publish(zipObjects(result))
    },
}
