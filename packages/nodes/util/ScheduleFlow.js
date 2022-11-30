import { url, httpsCallable } from "firebase-admin-callable-functions"

export default {
    id: "utility:ScheduleFlow",
    name: "Schedule Flow",
    targets: {
        values: {
            time: {},
        },
        signals: {
            signal: {
                async action(x) {
                    httpsCallable(url("runLater", {
                        projectId: global.admin.app().options.projectId,
                        local: process.env.FUNCTIONS_EMULATOR,
                    }))({
                        appId: global.info.appId,
                        flowId: this.state.flow,
                        time: (await this.time)[0]?.getTime(),
                        payload: x,
                    })
                        .then(r => r.json())
                        .then(r => r.result.error && console.log(r.result))
                }
            },
        }
    }
}