import { FieldValue } from "firebase-admin/firestore"
import functions from "firebase-functions"
import { db } from "./init.js"


export const disconnect = functions.https.onCall(async ({ appId, integrationId, accountId }, { auth }) => {

    // Get app
    const appRef = db.collection("apps").doc(appId)
    const app = await appRef.get().then(doc => doc.data())

    // Check ownership
    if (!app.owners.includes(auth.uid))
        throw new Error("You do not have permission to disconnect this app")

    // Remove integration
    await appRef.update({
        [`integrations.${integrationId}`]: FieldValue.arrayRemove(accountId),
    })
})