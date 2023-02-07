import { safeMap } from "../arrayUtilities.js"

export default {
    id: "text:Length",
    name: "Text Length",

    inputs: ["text"],
    outputs: ["length"],

    onInputsReady({ text }) {
        this.publish({
            length: safeMap(pickOp(this.state.mode), text)
        })
    },
}

function pickOp(mode) {
    switch (mode) {
        case "Character":
            return text => text.length
        case "Word":
            return text => text.split(/\s+/).length
    }
}