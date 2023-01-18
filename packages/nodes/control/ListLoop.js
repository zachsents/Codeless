

export default {
    id: "control:ListLoop",
    name: "List Loop",

    inputs: ["$ex", "list"],
    outputs: ["$"],

    onInputsReady({ $ex, list }) {
        for (let item of list)
            this.publish({ $: item })
    },
}
