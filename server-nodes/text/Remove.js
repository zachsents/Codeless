import { safeRegex } from "@minus/server-lib"
import { safeMap } from "../arrayUtilities.js"


export default {
    id: "text:Remove",

    inputs: ["text", "remove"],

    async onInputsReady({ text, remove }) {
        this.publish({
            result: safeMap((text, remove) => {
                if (typeof remove === "string")
                    return text?.replaceAll(remove, "")

                const pattern = safeRegex(remove)
                return text?.[pattern.global ? "replaceAll" : "replace"](pattern, "")
            }, text, remove)
        })
    },
}