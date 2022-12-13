import { url, httpsCallable } from "firebase-admin-callable-functions"

export default {
    id: "utility:RunFlow",
    name: "Run Flow",
    targets: {
        signals: {
            signal: {
                async action(x) {
                    const response = await httpsCallable(url("runNow", {
                        projectId: global.admin.app().options.projectId,
                        local: process.env.FUNCTIONS_EMULATOR,
                    }))({
                        appId: global.info.appId,
                        flowId: this.state.flow,
                        payload: x,
                    })
                    const { result } = await response.json()

                    result.error && console.log(result)
                }
            },
        }
    }
}