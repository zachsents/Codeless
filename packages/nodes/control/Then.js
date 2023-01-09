
export default {
    id: "control:Then",
    name: "Then",

    inputs: ["$condition"],
    outputs: ["$"],

    onInputsReady({ $condition }) {

        if($condition?.evaluate?.())
            this.publish({ $: $condition.executionSignal })
    },
}
