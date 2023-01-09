
export default {
    id: "control:Otherwise",
    name: "Otherwise",

    inputs: ["$condition"],
    outputs: ["$"],

    onInputsReady({ $condition }) {

        if($condition?.evaluate?.() === false)
            this.publish({ $: $condition.executionSignal })
    },
}
