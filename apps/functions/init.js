import admin from "firebase-admin"
import * as dotenv from "dotenv"
dotenv.config()

// initialize firebase app globalize/export
admin.initializeApp()
global.admin = admin
export const db = admin.firestore()
global.db = db

// set firestore settings
db.settings({ ignoreUndefinedProperties: true })

// ? set up slot for integrations
global.integrations = {}