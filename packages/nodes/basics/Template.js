import { safeMap } from "../arrayUtilities.js"


export default {
    id: "basic:Template",
    name: "Fill Template",

    inputs: ["template", "data"],
    outputs: ["text"],

    onInputsReady({ template, data }) {

        const state = this.state

        const text = safeMap(
            (currentTemplate, ...currentData) => currentData.reduce(
                (text, item, i) => {
                    const variableName = state.dataLabels[i]

                    if (!variableName)
                        return text

                    return text.replaceAll(`{${variableName}}`, item)
                },
                currentTemplate
            ),
            template, ...data,
        )

        this.publish({ text })
    },
}