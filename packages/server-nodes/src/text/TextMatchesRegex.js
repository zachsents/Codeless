import { safeMap } from "../arrayUtilities.js"

export default {
    id: "text:TextMatchesRegex",
    name: "Text Matches Regex",

    inputs: ["text", "regex"],
    outputs: ["_result"],

    async onInputsReady({ text, regex }) {
        this.publish({
            _result: safeMap((str, reg) => reg?.test?.(str), text, regex)
        })
    },
}