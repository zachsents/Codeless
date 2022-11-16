import functions from "firebase-functions"
import admin from "firebase-admin"

admin.initializeApp()
const db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
export const httpTrigger = functions.https.onRequest(async (request, response) => {
    const flowsSnapshot = await db.collectionGroup("flows").where("trigger", "==", "trigger:http").get()
    querySnapshot.forEach(doc => {
        console.log(doc.id, ' => ', doc.data());
    })
    response.send({ hello: "zach" })
})
