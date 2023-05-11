import { initializeTestEnvironment } from "@firebase/rules-unit-testing"
import * as dotenv from "dotenv"
import { setFirestoreInstance } from "../firebase-init.js"

// Grab environment variables
dotenv.config({ path: "tests/.env.local" })

export const UserId = "xxx"
export const OtherUserId = "yyy"

// Set up test environment
export const TestEnvironment = await initializeTestEnvironment({
    projectId: process.env.FIREBASE_PROJECT_ID,
    firestore: {
        host: "127.0.0.1",
        port: process.env.FIRESTORE_EMULATOR_PORT,
    }
})

export function setAuthenticatedContext(...args) {
    setFirestoreInstance(TestEnvironment.authenticatedContext(...args).firestore())
}

export function setUnauthenticatedContext() {
    setFirestoreInstance(TestEnvironment.unauthenticatedContext().firestore())
}