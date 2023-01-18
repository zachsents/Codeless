
export default {
    id: "exampleAction",
    name: "Example Action",
    inputs: ["_"],
    outputs: ["$"],

    onInputsReady({ _ }) {
        console.log("printing", _)
        this.publish({ $: _ })
    },
}