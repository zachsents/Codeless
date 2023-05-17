import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { auth } from "./firebase-init.js"
import { useQuery } from "react-query"


export function useAuthState() {
    const [user, setUser] = useState()
    useEffect(() => {
        if (!auth)
            return

        return onAuthStateChanged(auth, u => setUser(u))
    }, [auth])

    const isLoading = user === undefined

    return {
        user,
        isLoading,
        isLoggedIn: isLoading ? undefined : user !== null,
    }
}

export function useSignOut(queryProps = {}) {

    const { refetch, isFetching } = useQuery({
        queryKey: "signOut",
        queryFn: () => console.log("signing out") || auth.signOut(),
        enabled: false,
        ...queryProps,
    })

    return [refetch, isFetching]
}