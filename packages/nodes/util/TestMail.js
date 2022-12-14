
export default {
    id: "mail:TestMail",
    name: "Test Mail",
    targets: {
        signals: {
            " ": {
                async action(x) {
                    const toEmail = this.state.to ?? await this.to

                    if (!toEmail)
                        return

                    await global.admin.firestore().collection("mail")
                        .add({
                            to: toEmail,
                            message: {
                                subject: "♥ from No-Code",
                                text: `This is an email from the No-Code platform.\n\n${x}`,
                            },
                        })

                    console.log(`Mail queued to ${toEmail}.`)
                }
            }
        },
        values: {
            to: {}
        }
    },
}