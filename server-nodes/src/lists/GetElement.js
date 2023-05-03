import { safeMap } from "../arrayUtilities.js"


export default {
    id: "lists:GetElement",

    inputs: ["list", "index"],

    onInputsReady({ list, index }) {
        this.publish({
            element: safeMap(index => list[index], index),
        })
    },
}