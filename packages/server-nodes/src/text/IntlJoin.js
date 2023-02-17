
export default {
    id: "text:IntlJoin",
    name: "Join List to Text",

    inputs: ["list"],
    outputs: ["text"],

    async onInputsReady({ list }) {
        const formatter = new Intl.ListFormat("en", { style: this.state.style, type: this.state.type })

        this.publish({
            text: formatter.format(list)
        })
    },
}