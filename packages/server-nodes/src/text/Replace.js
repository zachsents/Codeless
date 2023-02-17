import { expectRegexToBeGlobal, safeMap } from "../arrayUtilities.js"

export default {
    id: "text:Replace",
    name: "Text Replace",

    inputs: ["inputText", "replace", "replaceWith"],
    outputs: ["outputText"],

    async onInputsReady({ inputText, replace, replaceWith }) {
        this.publish({
            outputText: safeMap(
                (input, replace, replaceWith) => input?.replaceAll(
                    expectRegexToBeGlobal(replace),
                    replaceWith ?? ""
                ),
                inputText, replace, replaceWith
            )
        })
    },
}