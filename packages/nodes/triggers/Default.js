
export default {
    id: "trigger:manual",
    name: "Default Trigger",
    sources: {
        signals: {
            " ": { }
        }
    },
    async setup(setupPayload) {
        await this[" "](setupPayload)
    },
}