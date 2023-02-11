import { safeMap } from "../arrayUtilities.js"

export default {
    id: "text:Length",
    name: "Text Length",

    inputs: ["text"],
    outputs: ["count"],

    onInputsReady({ text }) {
        this.publish({
            count: safeMap(text => {

                if(typeof text !== "string")
                    throw new Error("All inputs must be strings")

                return operation(this.state.mode, text)
            }, text)
        })
    },
}

function operation(mode, text) {
    switch (mode) {
        case "Character":
            return text.length
        case "Word":
            return text.split(/\s+/).length
    }
}