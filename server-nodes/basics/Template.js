import { unzipObject, safeMap } from "../arrayUtilities.js"


export default {
    id: "basic:Template",

    inputs: ["template", "data"],

    onInputsReady({ template, data }) {
        this.publish({
            result: safeMap((template, data) => data && Object.entries(data).reduce(
                (text, [key, val]) => text.replaceAll(`{${key}}`, val),
                template
            ), template, unzipObject(data))
        })
    },
}