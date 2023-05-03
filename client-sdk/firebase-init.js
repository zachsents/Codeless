import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator  } from "firebase/firestore"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

var app, analytics, firestore, auth, functions

export function initializeFirebase({ 
    analytics: includeAnalytics = true 
} = {}) {

    if (typeof window === "undefined")
        return

    // Initialize Firebase
    app = initializeApp(firebaseConfig)
    firestore = getFirestore(app)
    auth = getAuth(app)
    functions = getFunctions(app)
    includeAnalytics && (analytics = getAnalytics(app))

    // connect functions emulator
    if (process.env.NODE_ENV == "development") {
        connectFunctionsEmulator(functions, "localhost", process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT)
        connectFirestoreEmulator(firestore, "localhost", process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT)
    }
}

export { app, analytics, firestore, auth, functions }
