import { useDebouncedValue, useTimeout } from "@mantine/hooks"
import { useAuthState } from "@minus/client-sdk"
import fuzzy from "fuzzy"
import { useRouter } from "next/router"
import { useEffect, useId, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useNodes, useReactFlow } from "reactflow"


export function useMustBeSignedIn(route = "/login") {
    const router = useRouter()
    const { user, isLoggedIn } = useAuthState()

    useEffect(() => {
        isLoggedIn === false && router.replace(route)
    }, [isLoggedIn])

    return user
}


export function useMustNotBeSignedIn(route = "/apps") {
    const router = useRouter()
    const { isLoggedIn } = useAuthState()

    useEffect(() => {
        isLoggedIn && router.replace(route)
    }, [isLoggedIn])
}


export function useQueryParam(queryKey, defaultValue, setDefaultOnMount = false) {

    const router = useRouter()

    const value = router.query[queryKey] || defaultValue

    const setValue = newValue => {
        router.query[queryKey] = newValue
        router.replace(router, undefined, { shallow: true })
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    setDefaultOnMount && useEffect(() => {
        setValue(defaultValue)
    }, [])

    return [value, setValue]
}


export function useSearch(list, selector, searchQueryArg) {

    if (searchQueryArg === undefined)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        var [searchQuery, setSearchQuery] = useState("")

    const filtered = useMemo(
        () => list?.filter(
            item => fuzzy.test(
                searchQueryArg ?? searchQuery,
                selector?.(item) ?? item?.toString()
            )
        ),
        [list, searchQueryArg, searchQuery]
    )

    return [filtered, searchQuery, setSearchQuery]
}


export function useActionQuery(queryFn, queryKey, queryProps = {}) {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    queryKey ??= [useId()]

    const { refetch, ...result } = useQuery({
        queryKey,
        queryFn,
        enabled: false,
        ...queryProps,
    })

    return [refetch, result]
}


export function useAppId() {
    return useRouter().query.appId
}


export function useFlowId() {
    return useRouter().query.flowId
}


export function useDebouncedCustomState(remoteValue, remoteSetter, debounceTime = 200, {
    onNoUpdate,
} = {}) {

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
        else
            onNoUpdate?.()
    }, [debounced])

    return [value, setValue]
}


export function useMonostable() {
    const [value, setValue] = useState(false)
    useEffect(() => {
        value && setValue(false)
    }, [value])

    return [value, () => setValue(true)]
}


export function useCleanGhostEdgesEffect() {

    const rf = useReactFlow()
    const nodes = useNodes()

    // waiting a few seconds to enable the cleaner -- workaround for now to 
    // avoid the cleaner running on load
    const [enabled, setEnabled] = useState(false)
    useTimeout(() => setEnabled(true), 3000, {
        autoInvoke: true,
    })

    // create map of all source and target handle IDs
    const handleMap = useMemo(() => Object.fromEntries(
        nodes.map(node =>
            [node.id, {
                sources: node[Symbol.for("internals")].handleBounds?.source?.map(handle => handle.id) ?? [],
                targets: node[Symbol.for("internals")].handleBounds?.target?.map(handle => handle.id) ?? [],
            }]
        )
    ), [nodes])

    // remove edges that have a source or target that doesn't exist
    useEffect(() => {
        if (!enabled)
            return console.debug("[Cleaner] Skipping cleanup because it is not enabled yet")

        // on load, handleMap is empty -- this will never be the case after the first render
        if (Object.keys(handleMap).length === 0)
            return console.debug("[Cleaner] Skipping cleanup because there are no nodes (load effect)")

        // count up the number of handles in the map
        const handleCount = Object.values(handleMap).reduce((acc, { sources, targets }) => acc + sources.length + targets.length, 0)

        // skip if there are no handles -- this will never be the case after the first render
        if (handleCount === 0)
            return console.debug("[Cleaner] Skipping cleanup because there are no handles (load effect)")

        const edges = rf.getEdges()
        const newEdges = edges.filter(edge => {
            const source = handleMap[edge.source]
            const target = handleMap[edge.target]
            return source && target && source.sources.includes(edge.sourceHandle) && target.targets.includes(edge.targetHandle)
        })

        if (edges.length !== newEdges.length) {
            rf.setEdges(newEdges)
            console.debug("[Cleaner] Removed", edges.length - newEdges.length, "ghost edges")
        }
    }, [JSON.stringify(handleMap)])

}