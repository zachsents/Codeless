import {  useEffect, useMemo, useState } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { useRouter } from "next/router"
import fuzzy from "fuzzy"
import { useAuthState } from "@minus/client-sdk"


export function useMustBeSignedIn() {
    const user = useAuthState()
    const router = useRouter()
    useEffect(() => {
        user === null && router.push("/login")
    }, [user])

    return user
}


export function useSearch(list, selector) {
    const [searchQuery, setSearchQuery] = useState("")
    const filtered = useMemo(
        () => list?.filter(
            item => fuzzy.test(searchQuery, selector?.(item) ?? item?.toString())
        ),
        [list, searchQuery]
    )

    return [filtered, searchQuery, setSearchQuery]
}


export function useAppId() {
    return useRouter().query.appId
}


export function useFlowId() {
    return useRouter().query.flowId
}


export function useDebouncedCustomState(remoteValue, remoteSetter, debounceTime = 200) {

    const [value, setValue] = useState(remoteValue)

    // Note: this could cause problems if the update operation is slow
    // update value immediately when remote value changes
    // useEffect(() => {
    //     setValue(remoteValue)
    // }, [remoteValue])

    const [debounced] = useDebouncedValue(value, debounceTime)

    // update remote state when debounced state changes
    useEffect(() => {
        if (debounced !== undefined && debounced != remoteValue)
            remoteSetter?.(debounced)
    }, [debounced])

    return [value, setValue]
}