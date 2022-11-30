// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getDocs, getFirestore } from "firebase/firestore"
import {
    getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink
} from "firebase/auth"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import { useAuthState } from "firebase-web-helpers"
import { useEffect } from "react"
import { useRouter } from "next/router"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "nameless-948a8.firebaseapp.com",
    projectId: "nameless-948a8",
    storageBucket: "nameless-948a8.appspot.com",
    messagingSenderId: "526708433703",
    appId: "1:526708433703:web:aaf6896df75e734d19bf02",
    measurementId: "G-0ZD6KY1LX8"
}

if (typeof window !== "undefined") {
    // Initialize Firebase
    var app = initializeApp(firebaseConfig)
    var analytics = getAnalytics(app)
    var firestore = getFirestore(app)
    var auth = getAuth(app)
    var functions = getFunctions(app)

    // connect functions emulator
    if (process.env.NODE_ENV == "development")
        connectFunctionsEmulator(functions, "localhost", 5001)
}

export { app, analytics, firestore, auth, functions }



export async function sendEmailSignInLink(email) {
    const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_APP_HOST}/finishEmailSignIn`,
        handleCodeInApp: true,
    }

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings)
    }
    catch (error) {
        const errorCode = error.code
        const errorMessage = error.message
        console.error(errorCode, errorMessage)
    }
}

export async function finishEmailSignIn() {

    if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("signInEmail")
        if (!email)
            // TO DO: make an interface for this
            email = window.prompt('Please provide your email for confirmation')

        try {
            console.log(window.location.href)
            const result = await signInWithEmailLink(auth, email, window.location.href)
            // window.localStorage.removeItem("signInEmail")
            return result
        }
        catch (error) {
            console.error("Encountered an error signing in.", error)
        }
        return
    }
    console.error("Not a sign in link.")
}


export function useMustBeSignedIn() {
    const user = useAuthState(auth)
    const router = useRouter()
    useEffect(() => {
        user === null && router.push("/login")
    }, [user])

    return user
}
