
export default {
    id: "trigger:gmail:EmailReceived",
    name: "Gmail Received Email",
    sources: {
        signals: {
            " ": { }
        },
        values: {
            from: { get() { return this.state.from } },
            subject: { get() { return this.state.subject } },
            date: { get() { return this.state.date } },
            plainText: { get() { return this.state.plainText } },
            html: { get() { return this.state.html } },
        },
    },
    async setup(setupPayload) {
        this.state = {...setupPayload}
        await this[" "](setupPayload)
    },
}