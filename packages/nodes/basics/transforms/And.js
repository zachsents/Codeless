import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:And",
    name: "And",

    inputs: ["_a", "_b"],
    outputs: ["$"],
    
    onInputsReady({ _a, _b }) {
        this.publish({ 
            $: safeMap((a, b) => a && b, _a, _b) 
        })
    },
}