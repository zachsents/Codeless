
export default {
    id: "basic:DefaultTrigger",
    name: "Default Trigger",

    inputs: [],
    outputs: ["$"],

    onStart(setupPayload) {
        this.publish({ $: setupPayload })
    },
}