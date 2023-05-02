
export default {
    id: "lists:Count",

    inputs: ["list"],

    onInputsReady({ list }) {
        this.publish({ count: list.length })
    },
}