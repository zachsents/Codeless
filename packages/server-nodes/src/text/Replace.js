import { safeRegex } from "@minus/server-sdk"
import { safeMap } from "../arrayUtilities.js"


export default {
    id: "text:Replace",

    inputs: ["text", "replaceThis", "replaceWith"],

    async onInputsReady({ text, replaceThis, replaceWith }) {
        this.publish({
            result: safeMap((text, replaceThis, replaceWith) => {
                if (typeof replaceThis === "string")
                    return text?.replaceAll(replaceThis, replaceWith)

                const pattern = safeRegex(replaceThis)
                return text?.[pattern.global ? "replaceAll" : "replace"](pattern, replaceWith)
            }, text, replaceThis, replaceWith)
        })
    },
}