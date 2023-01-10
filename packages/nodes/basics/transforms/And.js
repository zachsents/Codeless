import { elementWise } from "../../arrayUtilities.js"


export default {
    id: "basic:And",
    name: "And",

    inputs: ["_a", "_b"],
    outputs: ["$"],
    
    onInputsReady({ _a, _b }) {
        this.publish({ $: elementWise(_a, _b, (a, b) => a && b) })
    },
}