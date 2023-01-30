import { expectRegexToBeGlobal, safeMap } from "../arrayUtilities.js"

export default {
    id: "text:Remove",
    name: "Text Remove",

    inputs: ["inputText", "remove"],
    outputs: ["outputText"],

    async onInputsReady({ inputText, remove }) {

        this.publish({
            outputText: safeMap(
                (input, remove) => input?.replaceAll(expectRegexToBeGlobal(remove), ""),
                inputText, remove
            )
        })
    },
}