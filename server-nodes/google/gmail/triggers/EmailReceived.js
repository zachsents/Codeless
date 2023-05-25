import { gmail, google, safeRegex } from "@minus/server-lib"


export default {
    id: "gmail:EmailReceivedTrigger",

    inputs: [],

    onStart(setupPayload) {
        // put message on variable so we can access it in other places
        this.graph.setVariable("_triggerEmail", setupPayload)

        this.publish(setupPayload)
    },

    async onDeploy({ flow }) {
        const gmailApi = await google.authManager.getAPI(this.data.selectedAccounts.google, {
            api: "gmail",
            version: "v1",
        })

        await gmail.watchInbox(gmailApi, {
            flow,
            labelIds: this.data["InputValue.labels"],
        })
    },

    async onUndeploy({ flow }) {
        await gmail.unwatchInbox(null, { flow })
    },

    validate({ payload }) {
        const subjectFilter = this.data["InputValue.subjectFilter"]

        if (!subjectFilter || !subjectFilter.source)
            return  // no filter, so no validation needed

        if (typeof subjectFilter === "string" && !payload.subject.includes(subjectFilter))
            throw new Error("Subject does not match filter")

        if (!safeRegex(subjectFilter).test(payload.subject))
            throw new Error("Subject does not match filter")
    }
}
