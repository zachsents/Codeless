import { Operation, Sentinel } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:Equals",
    name: "Equals",

    inputs: ["_a", "_b"],
    outputs: ["$"],

    onInputsReady({ _a, _b }) {

        this.publish({ 
            $: safeMap((a, b) => {

                if(a instanceof Sentinel || b instanceof Sentinel)
                    return Operation.Equals(a, b)

                return a == b
            }, _a, _b) 
        })
    },
}