
export default {
    id: "basic:SendEmail",
    name: "Send Email",

    inputs: ["to", "$subject", "$body"],
    outputs: [],

    async onInputsReady({ to, $subject, $body }) {
        await global.admin.firestore().collection("mail")
            .add({
                to,
                message: {
                    subject: $subject,
                    text: $body,
                },
            })
    },
}