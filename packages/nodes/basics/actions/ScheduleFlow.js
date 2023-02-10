import { Timestamp } from "firebase-admin/firestore"


export default {
    id: "basic:ScheduleFlow",
    name: "Schedule Flow",

    inputs: ["payload", "$time"],
    outputs: [],

    async onInputsReady({ payload, $time }) {

        await global.admin.firestore().collection("flowRuns").add({
            flow: this.state.flow,
            payload,
            scheduledFor: Timestamp.fromMillis($time.valueOf()),
            status: "scheduled",
            source: "flow",
        })
    },
}