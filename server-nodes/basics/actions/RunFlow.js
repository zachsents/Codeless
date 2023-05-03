import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:RunFlow",

    inputs: ["payload", "flow"],

    async onInputsReady({ payload, flow }) {

        /** @type {import("firebase-admin").firestore.Firestore} */
        const db = global.db
        const batch = db.batch()
        const flowRunCollection = db.collection("flowRuns")

        safeMap((payload, flow) => {

            if (!flow)
                throw new Error("No flow or invalid number of flows provided.")

            batch.set(flowRunCollection.doc(), {
                flow,
                payload,
                status: "pending",
                source: "flow",
            })
        }, payload, flow)

        await batch.commit()
    },
}