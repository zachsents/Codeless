
export default {
    id: "trigger:http",
    name: "Link Trigger",
    sources: {
        signals: {
            " ": { }
        }
    },
    async setup(setupPayload) {
        await this[" "](setupPayload)
    },
}