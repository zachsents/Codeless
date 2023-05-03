
export default {
    id: "basic:DefaultTrigger",

    inputs: [],

    onStart(setupPayload) {
        this.publish({ $: setupPayload })
    },
}