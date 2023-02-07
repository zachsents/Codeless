import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:Or",
    name: "Or",

    inputs: ["_a", "_b"],
    outputs: ["$"],
    
    onInputsReady({ _a, _b }) {
        this.publish({ 
            $: safeMap((a, b) => a || b, _a, _b) 
        })
    },
}