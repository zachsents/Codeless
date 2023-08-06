import { gmail, google } from "@minus/server-lib"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "gmail:AddLabel",

    inputs: ["messageId", "label"],

    async onInputsReady({ messageId, label }) {
        const gmailApi = await google.getGoogleAPIFromNode(this, "gmail", "v1")
        await safeMap((messageId, label) => gmail.modifyLabels(gmailApi, messageId, [label], [], false), messageId, label)
    },
}