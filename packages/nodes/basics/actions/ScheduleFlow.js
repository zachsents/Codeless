import { url, httpsCallable } from "firebase-admin-callable-functions"


export default {
    id: "basic:ScheduleFlow",
    name: "Schedule Flow",

    inputs: ["$ex", "payload", "$time"],
    outputs: ["$"],

    async onInputsReady({ $ex, payload, $time }) {

        // call function for running flow
        const response = await httpsCallable(url("runLater", {
            projectId: global.admin.app().options.projectId,
            local: process.env.FUNCTIONS_EMULATOR,
        }))({
            appId: global.info.appId,
            flowId: this.state.flow,
            time: $time.getTime(),
            payload,
        })
        const { result } = await response.json()

        // add execution result to signal
        $ex.push(result)

        // print if there was an error
        result.error && console.error(result)

        this.publish({ $: $ex })
    },
}