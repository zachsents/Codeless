import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth"
import { getDocs } from "firebase/firestore"
import { useEffect, useState } from "react"

/** 
 * Auth
*/

export async function signInWithGoogle(auth, scopes = []) {

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

export function useAuthState(auth) {
    const [user, setUser] = useState()
    useEffect(() => {
        auth && onAuthStateChanged(auth, u => setUser(u))
    }, [auth])
    return user
}

export function signOut(auth) {
    auth.signOut()
}


/** 
 * Firestore utilities
*/

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