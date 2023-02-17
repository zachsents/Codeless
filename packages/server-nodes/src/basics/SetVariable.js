
export default {
    id: "basic:SetVariable",
    name: "Set Variable",

    inputs: ["$"],
    outputs: [],

    onInputsReady({ $ }) {
        global.variables?.[this.state.name]?.publish($)
    },
}