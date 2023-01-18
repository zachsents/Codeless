import { url, httpsCallable } from "firebase-admin-callable-functions"


export default {
    id: "basic:RunFlow",
    name: "Run Flow",

    inputs: ["$ex", "payload"],
    outputs: ["$"],

    async onInputsReady({ $ex, payload }) {
        // call function for running flow
        const response = await httpsCallable(url("runNow", {
            projectId: global.admin.app().options.projectId,
            local: process.env.FUNCTIONS_EMULATOR,
        }))({
            appId: global.info.appId,
            flowId: this.state.flow,
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