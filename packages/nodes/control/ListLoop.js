

export default {
    id: "control:ListLoop",
    name: "List Loop",

    inputs: ["$list"],
    outputs: ["item"],

    onInputsReady({ $list }) {
        for (let item of $list)
            this.publish({ item })
    },
}
