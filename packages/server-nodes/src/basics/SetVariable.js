import { VariablePort } from "@minus/server-sdk"

export default {
    id: "basic:SetVariable",
    name: "Set Variable",

    inputs: ["$"],
    outputs: [],

    onInputsReady({ $ }) {
        VariablePort.publish(this.state.name, $)
    },
}