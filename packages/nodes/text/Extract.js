import { expectRegexToBeGlobal, safeMap } from "../arrayUtilities.js"

export default {
    id: "text:Extract",
    name: "Extract",

    inputs: ["text", "pattern"],
    outputs: ["extracted"],


    onInputsReady({ text, pattern }) {
        this.publish({
            extracted: safeMap(
                (text, pattern) => {
                    const match = text.match(pattern)
                    return pattern.global ? match : match?.[0]
                },
                text,
                pattern
            )
        })
    },
}