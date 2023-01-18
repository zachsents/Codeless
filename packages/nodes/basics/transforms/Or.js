import { elementWise } from "../../arrayUtilities.js"


export default {
    id: "basic:Or",
    name: "Or",

    inputs: ["_a", "_b"],
    outputs: ["$"],
    
    onInputsReady({ _a, _b }) {
        this.publish({ $: elementWise(_a, _b, (a, b) => a || b) })
    },
}