import { Condition, ExecutionSignal } from "../types/index.js"


export default {
    id: "control:If",
    name: "If",

    inputs: ["$ex"],
    outputs: ["$"],

    onInputsReady({ $ex }) {
        this.publish({ $: new Condition($ex ?? new ExecutionSignal()) })
    },
}
