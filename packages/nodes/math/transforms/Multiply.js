import { elementWise } from "../../arrayUtilities.js"


export default {
    id: "math:Multiply",
    name: "Multiply",

    inputs: ["_a", "_b"],
    outputs: ["$"],
    
    onInputsReady({ _a, _b }) {
        this.publish({ $: elementWise(_a, _b, (a, b) => a * b) })
    },
}