import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:And",
    name: "And",

    inputs: ["_a", "_b"],
    outputs: ["$"],
    
    onInputsReady({ _a, _b }) {
        this.publish({ 
            $: safeMap((a, b) => {

                if(a instanceof Sentinel || b instanceof Sentinel)
                    return Condition.And(a, b)

                return !!a && !!b
            }, _a, _b) 
        })
    },
}