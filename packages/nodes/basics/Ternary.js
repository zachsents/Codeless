import { safeMap } from "../arrayUtilities.js"

export default {
    id: "basic:Ternary",
    name: "Ternary",

    inputs: ["condition", "ifTrue", "ifFalse"],
    outputs: ["output"],

    
    onInputsReady({ condition, ifTrue, ifFalse }) {
        this.publish({ 
            output: safeMap((cond, a, b) => cond ? a : b, condition, ifTrue, ifFalse)
        })
    },
}