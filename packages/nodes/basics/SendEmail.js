import { safeMap } from "../arrayUtilities.js"

export default {
    id: "basic:SendEmail",
    name: "Send Email",

    inputs: ["to", "subject", "body"],
    outputs: [],

    onInputsReady({ to, subject, body }) {
        return Promise.all(
            safeMap(sendEmail, to, subject, body)
        )
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