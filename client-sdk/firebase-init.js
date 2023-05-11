import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"


const defaultConfig = {
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
    firestore: includeFirestore = true,
    functions: includeFunctions = true,
    auth: includeAuth = true,
    analytics: includeAnalytics = true,
    config = defaultConfig,
    functionsEmulatorPort = process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_PORT,
    firestoreEmulatorPort = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT,
} = {}) {

    if (typeof window === "undefined")
        return

    // Initialize Firebase
    app = initializeApp(config)
    includeFirestore && (firestore = getFirestore(app))
    includeAuth && (auth = getAuth(app))
    includeFunctions && (functions = getFunctions(app))
    includeAnalytics && (analytics = getAnalytics(app))

    // connect emulators
    if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") {
        if (includeFunctions)
            connectFunctionsEmulator(functions, "localhost", functionsEmulatorPort)
        if (includeFirestore)
            connectFirestoreEmulator(firestore, "localhost", firestoreEmulatorPort)
    }
}

export { app, analytics, firestore, auth, functions }


export function setFirestoreInstance(instance) {
    firestore = instance
}