import { RunStatus } from "@minus/server-sdk"
import { delist, safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:RunFlow",

    inputs: ["payload", "flow"],

    async onInputsReady({ payload, flow }) {

        /** @type {import("firebase-admin").firestore.Firestore} */
        const db = global.db
        const batch = db.batch()
        const flowRunCollection = db.collection("flowRuns")

        // create a run for each flow using a batched write
        /** @type {import("firebase-admin").firestore.DocumentReference[]} */
        const runRefs = safeMap((payload, flow) => {

            if (!flow)
                throw new Error("No flow or invalid number of flows provided.")

            const runRef = flowRunCollection.doc()

            batch.set(runRef, {
                flow,
                payload,
                status: "pending",
                source: "flow",
            })

            return runRef
        }, payload, flow)

        await batch.commit()

        this.publish({
            // set up snapshot listeners to see when the run is finished
            "return": await Promise.all(runRefs.map(waitForRunToFinish))
        })
    },
}


function waitForRunToFinish(runRef) {
    return new Promise((resolve) => {
        const unsubscribe = runRef.onSnapshot(snapshot => {
            const runData = snapshot.data()
            switch (runData.status) {
                case RunStatus.Finished:
                case RunStatus.FinishedWithErrors:
                case RunStatus.Failed:
                case RunStatus.FailedValidation:
                    unsubscribe()
                    resolve(delist(runData.returns?.data))
                    return
            }
        })
    })
}