import { safeMap } from "../arrayUtilities.js"

const WordRegex = /\w+/g

export default {
    id: "text:Length",

    inputs: ["text"],

    onInputsReady({ text }) {
        this.publish({
            wordCount: validateAndMap(text, text => text.match(WordRegex).length),
            characterCount: validateAndMap(text, text => text.length),
        })
    },
}

function validateAndMap(text, operation) {
    return safeMap(text => {

        if (typeof text !== "string")
            throw new Error("All inputs must be strings")

        return operation(text)
    }, text)
}