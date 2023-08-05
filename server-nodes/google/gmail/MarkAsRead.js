import { gmail, google } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:MarkAsRead",

    inputs: ["messageId"],

    async onInputsReady({ messageId }) {
        const gmailApi = await google.getGoogleAPIFromNode(this, "gmail", "v1")
        await safeMap(messageId => gmail.modifyLabels(gmailApi, messageId, [], ["UNREAD"]), messageId)
    },
}