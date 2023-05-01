
export default {
    id: "basic:Count",
    name: "Count",

    inputs: ["list"],
    outputs: ["count"],

    onInputsReady({ list }) {
        this.publish({ count: list.length })
    },
}