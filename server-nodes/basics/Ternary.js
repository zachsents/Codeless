import { OperationFactory } from "@minus/server-lib"
import { safeMap } from "../arrayUtilities.js"


export default {
    id: "basic:Ternary",

    inputs: ["condition", "ifTrue", "ifFalse"],

    onInputsReady({ condition, ifTrue, ifFalse }) {
        this.publish({
            output: safeMap(
                OperationFactory.Fixed(
                    "ternary",
                    (cond, a, b) => cond ? a : b
                ),
                condition, ifTrue, ifFalse
            )
        })
    },
}