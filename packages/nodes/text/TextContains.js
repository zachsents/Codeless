import { safeMap } from "../arrayUtilities.js"

export default {
    id: "text:TextContains",
    name: "Text Contains",

    inputs: ["text", "containedText"],
    outputs: ["_result"],

    async onInputsReady({ text, containedText }) {
        this.publish({
            _result: safeMap((a, b) => a?.includes?.(b), text, containedText)
        })
    },
}