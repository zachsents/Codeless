import { useEffect, useMemo, useState } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { useRouter } from "next/router"
import fuzzy from "fuzzy"
import { useAuthState } from "@minus/client-sdk"
import { useNodes, useReactFlow } from "reactflow"


export function useMustBeSignedIn() {
    const user = useAuthState()
    const router = useRouter()
    useEffect(() => {
        user === null && router.push("/login")
    }, [user])

    return user
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