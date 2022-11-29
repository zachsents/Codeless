import { url, httpsCallable } from "firebase-admin-callable-functions"

export default {
    id: "utility:RunFlow",
    name: "Run Flow",
    targets: {
        signals: {
            signal: {
                action(x) {
                    httpsCallable(url("runNow", {
                        projectId: global.admin.app().options.projectId,
                        local: process.env.FUNCTIONS_EMULATOR,
                    }))({
                        appId: this.state.appId,
                        flowId: this.state.flow,
                        payload: x,
                    })
                        .then(r => r.json())
                        .then(r => r.result.error && console.log(r.result))
                }
            },
        }
    }
}