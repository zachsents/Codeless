import { forms, google } from "@minus/server-lib"


export default {
    id: "googleforms:OnFormSubmission",

    inputs: [],

    onStart(setupPayload) {
        this.publish(setupPayload)
    },

    async onDeploy({ flow }) {
        const formsApi = await google.authManager.getAPI(this.data.selectedAccounts.google, {
            api: "forms",
            version: "v1",
        })

        await forms.watchForm(formsApi, {
            flow,
            formId: this.state.formId,
        })
    },

    async onUndeploy({ flow }) {
        const formsApi = await google.authManager.getAPI(this.data.selectedAccounts.google, {
            api: "forms",
            version: "v1",
        })

        await forms.unwatchForm(formsApi, {
            flow,
            formId: this.state.formId,
        })
    },
}
