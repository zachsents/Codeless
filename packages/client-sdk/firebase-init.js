import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator  } from "firebase/firestore"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"


const firebaseConfig = apiKey => ({
    apiKey,
    authDomain: "nameless-948a8.firebaseapp.com",
    projectId: "nameless-948a8",
    storageBucket: "nameless-948a8.appspot.com",
    messagingSenderId: "526708433703",
    appId: "1:526708433703:web:aaf6896df75e734d19bf02",
    measurementId: "G-0ZD6KY1LX8"
})

var app, analytics, firestore, auth, functions

export function initializeFirebase(apiKey, { 
    analytics: includeAnalytics = true 
} = {}) {

    if (typeof window === "undefined")
        return

    // Initialize Firebase
    app = initializeApp(firebaseConfig(apiKey))
    firestore = getFirestore(app)
    auth = getAuth(app)
    functions = getFunctions(app)
    includeAnalytics && (analytics = getAnalytics(app))

    // connect functions emulator
    if (process.env.NODE_ENV == "development") {
        connectFunctionsEmulator(functions, "localhost", 5001)
        connectFirestoreEmulator(firestore, "localhost", 8080)
    }
}

export { app, analytics, firestore, auth, functions }
