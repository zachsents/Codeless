import { safeMap } from "../arrayUtilities.js"


export default {
    id: "basic:Template",
    name: "Fill Template",

    inputs: ["template", "data"],
    outputs: ["text"],

    onInputsReady({ template, data }) {

        const text = safeMap(
            (currentTemplate, ...currentData) => currentData.reduce(
                (text, item) => text.replaceAll(`{${item.label}}`, item.value),
                currentTemplate
            ),
            template, ...data,
        )

        this.publish({ text })
    },
}