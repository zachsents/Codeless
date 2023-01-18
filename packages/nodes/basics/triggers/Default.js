import { ExecutionSignal } from "../../types/index.js"


export default {
    id: "basic:DefaultTrigger",
    name: "Default Trigger",

    inputs: [],
    outputs: ["$"],

    onStart(setupPayload) {
        const $ = new ExecutionSignal()
        $.push(setupPayload)
        this.publish({ $ })
    },
}