
export default {
    id: "basic:LoopFlow",
    name: "Loop Flow",

    inputs: ["list"],
    outputs: [],

    async onInputsReady({ list }) {

        const db = global.admin.firestore()
        const batch = db.batch()
        const flowRunCollection = db.collection("flowRuns")

        list.forEach(item => {
            batch.set(flowRunCollection.doc(), {
                flow: this.state.flow,
                payload: item,
                status: "pending",
                source: "flow",
            })
        })

        await batch.commit()
    },
}