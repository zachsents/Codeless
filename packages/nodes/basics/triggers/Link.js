import { ExecutionSignal } from "../../types/index.js"


export default {
    id: "basic:LinkTrigger",
    name: "Trigger Trigger",

    inputs: [],
    outputs: ["$"],

    onStart(setupPayload) {
        const $ = new ExecutionSignal()
        $.push(setupPayload)
        this.publish({ $ })
    },
}