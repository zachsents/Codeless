import { PubSub } from "@google-cloud/pubsub"
import { registerImportedPackage } from "@minus/gee3"
import admin from "firebase-admin"


// initialize firebase app globalize/export
admin.initializeApp()
global.admin = admin
export { admin }

export const db = admin.firestore()
global.db = db

// set firestore settings
db.settings({ ignoreUndefinedProperties: true })

// initialize and export Pubsub client
export const pubsub = new PubSub()

// register node definitions
await registerImportedPackage(import("@minus/server-nodes"))

