import { safeMap } from "../../arrayUtilities.js"


export default {
    id: "basic:SendEmail",

    inputs: ["to", "cc", "subject", "body"],

    async onInputsReady({ to, cc, subject, body }) {

        /** @type {import("firebase-admin").firestore.Firestore} */
        const db = global.db
        const batch = db.batch()
        const mailCollection = db.collection("mail")

        safeMap((to, cc, subject, body) => {
            const docRef = mailCollection.doc()
            console.debug("Creating mail document:", docRef.id)

            batch.set(docRef, {
                to,
                cc,
                message: {
                    subject,
                    text: body,
                },
            })
        }, to, cc, subject, body)

        await batch.commit()
    },
}