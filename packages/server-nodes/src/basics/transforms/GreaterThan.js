import { Operation, Sentinel } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:GreaterThan",
    name: "Greater Than",

    inputs: ["_a", "_b"],
    outputs: ["$"],

    onInputsReady({ _a, _b }) {
        
        ((a, b) => {
            if (a instanceof Sentinel || b instanceof Sentinel)
                return Operation.GreaterThan(a, b)

            return a > b
        })
            |> safeMap(^^, _a, _b)
            |> this.publish({ $: ^^ })
    },
}