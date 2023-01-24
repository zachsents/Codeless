
export default {
    id: "text:Join",
    name: "Join List to Text",

    inputs: ["list"],
    outputs: ["text"],

    async onInputsReady({ list }) {
        this.publish({
            text: (this.state.useLast ? list.slice(0, -1) : list)
                .join(this.state.join) +
                (this.state.useLast ? this.state.last + list[list.length - 1] : "")
        })
    },
}