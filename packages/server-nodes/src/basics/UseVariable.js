
export default {
    id: "basic:UseVariable",
    name: "Use Variable",

    inputs: [],
    outputs: ["$"],

    onBeforeStart() {
        this.graph.subscribeToVariable(this.state.name, value => {
            this.publish({ $: value })
        })
    },
}

