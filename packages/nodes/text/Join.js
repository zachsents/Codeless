
export default {
    id: "text:Join",
    name: "Join List to Text",

    inputs: ["list"],
    outputs: ["text"],

    async onInputsReady({ list }) {
        const join = clean(this.state.join)
        const last = clean(this.state.last)

        this.publish({
            text: (this.state.useLast ? list.slice(0, -1) : list)
                .join(join) +
                (this.state.useLast ? last + list[list.length - 1] : "")
        })
    },
}

function clean(str) {
    return str.replaceAll("\\n", "\n")
        .replaceAll("\\t", "\t")
}