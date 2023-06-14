import { safeMap } from "../../arrayUtilities.js"
import { Timestamp } from "firebase-admin/firestore"


export default {
    id: "basic:ScheduleFlow",

    inputs: ["flow", "payload", "time"],

    async onInputsReady({ payload, flow, time }) {

        /** @type {import("firebase-admin").firestore.Firestore} */
        const db = global.db
        const batch = db.batch()
        const flowRunCollection = db.collection("flowRuns")

        safeMap((payload, flow, time) => {

            if (!flow)
                throw new Error("No flow or invalid number of flows provided.")

            const docRef = flowRunCollection.doc()
            console.debug("Scheduling run:", docRef.id)

            batch.set(docRef, {
                flow,
                payload,
                scheduledFor: Timestamp.fromDate(new Date(time)),
                status: "scheduled",
                source: "flow",
            })
        }, payload, flow, time)

        await batch.commit()
    },
}