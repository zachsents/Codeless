import { safeMap } from "../arrayUtilities.js"


export default {
    id: "lists:GetElement",

    inputs: ["list", "index"],

    /**
     * @param {object} inputs
     * @param {any[]} inputs.list
     * @param {number} inputs.index
     */
    onInputsReady({ list, index }) {
        this.publish({
            element: safeMap(index => list.at(index - 1), index),
        })
    },
}