
export default {
    id: "gmail:EmailReceivedTrigger",
    name: "Gmail Received Email",

    inputs: [],
    outputs: ["fromName", "fromEmail", "subject", "date", "plainText", "html"],

    onStart(setupPayload) {
        // "From" field sometimes looks like this: First Last <email@gmail.com>
        // let's parse it out first
        const { from, ...otherFields } = setupPayload
        const [, fromName, fromEmail] = from.match(/(.+?\s)<(.+?)>/) ?? [,, from]

        this.publish({ fromName, fromEmail, ...otherFields })
    },
}