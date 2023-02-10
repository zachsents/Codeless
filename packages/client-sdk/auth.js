import { GoogleAuthProvider, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, signInWithPopup } from "firebase/auth"
import { auth } from "./firebase-init.js"


export async function signInWithGoogle(scopes = []) {

    // set up provider
    const provider = new GoogleAuthProvider()    

    // add scopes
    scopes.forEach(scope => provider.addScope(scope))

    // login
    try {
        const result = await signInWithPopup(auth, provider)
        return {
            credential: GoogleAuthProvider.credentialFromResult(result),
            user: result.user,
        }
    }
    catch (error) {
        const errorCode = error.code
        const errorMessage = error.message
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
            const result = await signInWithEmailLink(auth, email, window.location.href)
            return result
        }
        catch (error) {
            console.error("Encountered an error signing in.", error)
        }
        return
    }
    console.error("Not a sign in link.")
}


export function signOut() {
    auth.signOut()
}