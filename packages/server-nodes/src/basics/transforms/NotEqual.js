import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:NotEqual",
    name: "Not Equal",

    inputs: ["_a", "_b"],
    outputs: ["$"],
    
    onInputsReady({ _a, _b }) {
        this.publish({ 
            $: safeMap((a, b) => a != b, _a, _b) 
        })
    },
}