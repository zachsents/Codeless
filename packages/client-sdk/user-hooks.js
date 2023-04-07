import { useEffect, useState } from "react"
import { useRealtime } from "./firestore-util.js"
import { getUserRef } from "./user-actions.js"
import { auth } from "./firebase-init.js"
import { onAuthStateChanged } from "firebase/auth"
import { setDoc } from "firebase/firestore"



/**
 * Hook that provides a real-time updated state object containing
 * user document.
 *
 * @export
 * @param {string} userId
 */
export function useUserRealtime(userId) {
    return useRealtime(getUserRef(userId))
}


/**
 * Hook that provides a real-time updated state object containing
 * user document for the currently logged in user.
 *
 * @export
 */
export function useCurrentUserRealtime() {
    const user = useCurrentUser()
    const [userDoc] = useUserRealtime(user?.uid)

    // create user document if it doesn't exist
    useEffect(() => {
        if (user?.uid && userDoc === false)
            setDoc(getUserRef(user.uid), {}, { merge: true })
    }, [userDoc, user])

    return userDoc || (user?.uid ? { id: user?.uid } : null)
}


/**
 * Hook that provides the currently logged in user.
 */
export function useCurrentUser() {
    const [user, setUser] = useState()
    useEffect(() => {
        if (!auth)
            return

        return onAuthStateChanged(auth, u => setUser(u))
    }, [auth])
    return user
}