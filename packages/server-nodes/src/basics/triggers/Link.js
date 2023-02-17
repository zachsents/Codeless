
export default {
    id: "basic:LinkTrigger",
    name: "Trigger Trigger",

    inputs: [],
    outputs: ["$"],

    onStart(setupPayload) {
        this.publish({ $: setupPayload })
    },
}