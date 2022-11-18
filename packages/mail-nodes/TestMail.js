import admin from "firebase-admin"


export default {
    id: "mail:TestMail",
    name: "Test Mail",
    targets: {
        signals: {
            " ": {
                action(x) {
                    const toEmail = this.to
                    admin.firestore().collection("mail")
                        .add({
                            to: this.to,
                            message: {
                                subject: "♥ from No-Code",
                                text: `This is an email from the No-Code platform.\n\n${x}`,
                            },
                        })
                        .then(() => {
                            console.log(`Mail queued to ${toEmail}.`)
                        })
                }
            }
        },
        values: {
            to: {}
        }
    },
}