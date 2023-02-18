import { Operation, Sentinel } from "@minus/server-sdk"
import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:Not",
    name: "Not",

    inputs: ["_in"],
    outputs: ["_out"],

    onInputsReady({ _in }) {
        
        (input => {
            if (input instanceof Sentinel)
                return Operation.Not(input)

            return !input
        })
            |> safeMap(^^, _in)
            |> this.publish({ _out: ^^ })
    },
}