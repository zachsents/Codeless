import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "./firebase-init.js"


export function useAuthState() {
    const [user, setUser] = useState()
    useEffect(() => {
        if (!auth)
            return

        return onAuthStateChanged(auth, u => setUser(u))
    }, [auth])
    return user
}