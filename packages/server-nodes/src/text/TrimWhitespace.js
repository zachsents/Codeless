
export default {
    id: "text:TrimWhitespace",

    inputs: ["text"],

    async onInputsReady({ text }) {
        this.publish({
            trimmedText: text.map(text => text?.trim?.())
        })
    },
}