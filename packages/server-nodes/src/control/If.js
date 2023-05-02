
export default {
    id: "control:If",

    inputs: ["$condition", "value"],

    onInputsReady({ $condition, value }) {
        this.publish({
            [$condition ? "then" : "otherwise"]: value,
        })
    },
}
