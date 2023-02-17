import { safeMap } from "../arrayUtilities.js"

export default {
    id: "text:TextAround",
    name: "Text Around",

    inputs: ["text", "target"],
    outputs: ["surroundingText"],


    onInputsReady({ text, target }) {

        const surroundingText = safeMap(
            (text, target) => {

                if (!text)
                    return

                const pattern = target?.source ?? target ?? ""

                // only match one
                if (this.state.onlyFirst) {
                    const flags = "d" + (target?.flags?.replaceAll(/[gd]/g, "") ?? "")
                    const result = text.match(new RegExp(pattern, flags))
                    return grabSubstring(result, text, this.state.reach)
                }

                const flags = "dg" + (target?.flags?.replaceAll(/[gd]/g, "") ?? "")
                const result = text.matchAll(new RegExp(pattern, flags))

                return [...result].map(res => grabSubstring(res, text, this.state.reach))
            },
            text, target
        )

        this.publish({
            surroundingText: surroundingText.length == 1 && !this.state.onlyFirst ?
                surroundingText[0] :
                surroundingText
        })
    }
}


function grabSubstring(regResult, text, reach) {
    return regResult && text.slice(
        Math.max(regResult.indices[0][0] - reach, 0),
        Math.min(regResult.indices[0][1] + reach, text.length)
    )
}