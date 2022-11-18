// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getDocs, getFirestore } from "firebase/firestore"
import {
    getAuth, signInWithPopup, GoogleAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink,
    signInWithEmailLink, onAuthStateChanged
} from "firebase/auth"
import { getFunctions } from "firebase/functions"
import { useEffect, useState } from "react"
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
}

export { app, analytics, firestore, auth, functions }

export async function signInWithGoogle() {

    // set up provider
    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly')

    // login
    try {
        const result = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        const user = result.user
        return user
    }
    catch (error) {
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.customData.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.error(errorCode, errorMessage, credential)
    }
}

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

export function useAuthState() {
    const [user, setUser] = useState()
    useEffect(() => {
        auth && onAuthStateChanged(auth, u => setUser(u))
    }, [])
    return user
}

export function useMustBeSignedIn() {
    const user = useAuthState()
    const router = useRouter()
    useEffect(() => {
        user === null && router.push("/login")
    }, [user])

    return user
}

export function signOut() {
    auth.signOut()
}

export async function getMappedDocs(ref) {
    return mapSnapshot(await getDocs(ref))
}

export function mapSnapshot(snapshot) {
    return snapshot.docs.map(mapDoc)
}

export function mapDoc(doc) {
    return doc.exists() && {
        id: doc.id,
        ...doc.data(),
    }
}