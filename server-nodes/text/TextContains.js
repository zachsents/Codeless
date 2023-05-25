import { safeRegex } from "@minus/server-lib"
import { safeMap } from "../arrayUtilities.js"


export default {
    id: "text:TextContains",

    inputs: ["text", "target"],

    async onInputsReady({ text, target }) {
        this.publish({
            result: safeMap(
                (text, target) => typeof target === "string" ?
                    text.includes(target) :
                    safeRegex(target).test(text),
                text, target
            )
        })
    },
}