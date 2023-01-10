import { ExecutionSignal } from "../types/index.js"


export default {
    id: "control:If",
    name: "If",

    inputs: ["$ex", "condition"],
    outputs: ["then", "otherwise"],

    onInputsReady({ $ex, condition }) {
        this.publish({
            [condition ? "then" : "otherwise"]: $ex ?? new ExecutionSignal(),
        })
    },
}
