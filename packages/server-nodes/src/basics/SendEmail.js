import { safeMap } from "../arrayUtilities.js"

export default {
    id: "basic:SendEmail",
    name: "Send Email",

    inputs: ["to", "subject", "body"],
    outputs: [],

    async onInputsReady({ to, subject, body }) {
        await safeMap(sendEmail, to, subject, body)
    },
}

function sendEmail(to, subject, body) {
    return global.admin.firestore().collection("mail")
        .add({
            to,
            message: {
                subject,
                text: body,
            },
        })
}