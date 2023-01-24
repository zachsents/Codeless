import { url, httpsCallable } from "firebase-admin-callable-functions"


export default {
    id: "basic:RunFlow",
    name: "Run Flow",

    inputs: ["payload"],
    outputs: [],

    async onInputsReady({ payload }) {
        // call function for running flow
        const response = await httpsCallable(url("runNow", {
            projectId: global.admin.app().options.projectId,
            local: process.env.FUNCTIONS_EMULATOR,
        }))({
            appId: global.info.appId,
            flowId: this.state.flow,
            payload: payload,
        })
        const { result } = await response.json()

        // print if there was an error
        result.error && console.error(result)
    },
}