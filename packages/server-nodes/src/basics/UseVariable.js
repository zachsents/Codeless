import { VariablePort } from "@minus/server-sdk"

export default {
    id: "basic:UseVariable",
    name: "Use Variable",

    inputs: [],
    outputs: ["$"],

    onBeforeStart() {
        VariablePort.setupPortOnGlobals(this.state.name).subscribe(value => {
            this.publish({ $: value })
        })
    },
}

