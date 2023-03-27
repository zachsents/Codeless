
export default {
    id: "basic:SetVariable",
    name: "Set Variable",

    inputs: ["$"],
    outputs: [],

    onInputsReady({ $ }) {
        this.graph.setVariable(this.state.name, $)
    },
}