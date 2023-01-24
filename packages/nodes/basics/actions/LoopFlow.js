import { httpsCallable, url } from "firebase-admin-callable-functions"


export default {
    id: "basic:LoopFlow",
    name: "Loop Flow",

    inputs: ["list"],
    outputs: [],

    async onInputsReady({ list }) {
        for (let item of list) {
            
            // call function for running flow
            const response = await httpsCallable(url("runNow", {
                projectId: global.admin.app().options.projectId,
                local: process.env.FUNCTIONS_EMULATOR,
            }))({
                appId: global.info.appId,
                flowId: this.state.flow,
                payload: item,
            })
            const { result } = await response.json()

            // print if there was an error
            result.error && console.error(result)
        }
    },
}