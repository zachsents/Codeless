
export default {
    id: "text:TrimWhitespace",
    name: "Trim Whitespace",

    inputs: ["inputText"],
    outputs: ["trimmedText"],

    async onInputsReady({ inputText }) {
        this.publish({ trimmedText: inputText.map(text => text.trim?.()) })
    },
}