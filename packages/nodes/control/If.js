import { ExecutionSignal } from "../types/index.js"


export default {
    id: "control:If",
    name: "If",

    inputs: ["$condition", "_then", "_otherwise"],
    outputs: ["then", "otherwise"],

    onInputsReady({ $condition, _then, _otherwise }) {
        this.publish(
            $condition ?
                { then: _then } :
                { otherwise: _otherwise }
        )
    },
}
