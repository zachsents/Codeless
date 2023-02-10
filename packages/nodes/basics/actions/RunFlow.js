
export default {
    id: "basic:RunFlow",
    name: "Run Flow",

    inputs: ["payload"],
    outputs: [],

    async onInputsReady({ payload }) {

        await global.admin.firestore().collection("flowRuns").add({
            flow: this.state.flow,
            payload,
            status: "pending",
            source: "flow",
        })
    },
}