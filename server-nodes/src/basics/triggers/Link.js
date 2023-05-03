
export default {
    id: "basic:LinkTrigger",

    inputs: [],

    onStart(setupPayload) {
        this.publish({ $: setupPayload })
    },
}