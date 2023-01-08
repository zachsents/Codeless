
export default {
    id: "exampleAction",
    name: "Example Action",
    inputs: ["$"],
    outputs: ["_"],

    onInputsReady({ $ }) {
        console.log("printing", $)
        this.publish({ _: $ })
    },
}