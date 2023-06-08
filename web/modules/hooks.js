import { useDebouncedValue, useTimeout } from "@mantine/hooks"
import { useAuthState, useRenameApp, useRenameFlow } from "@minus/client-sdk"
import fuzzy from "fuzzy"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
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

    const value = router.query[queryKey]

    const setValue = newValue => {
        // getting a this error on fresh page load with dynamic routes and useQueryParam hook:
        // https://nextjs.org/docs/messages/href-interpolation-failed
        // This should fix it
        if (!router.isReady)
            return

        router.query[queryKey] = newValue
        router.replace(router, undefined, { shallow: true })
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        setDefaultOnMount && value == null && setValue(defaultValue)
    }, [router.isReady])

    return [value ?? defaultValue, setValue]
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


/**
 * Utility hook for renaming apps. Returns everything you need
 * to rename an app with an EditbaleText component.
 *
 * @export
 * @param {string} appId
 * @return {{ isRenaming: boolean, startRenaming: () => void, onRename: (newName: string) => void, onCancel: () => void }} 
 */
export function useAppRenaming(appId) {
    const [renaming, setRenaming] = useState(false)
    const renameApp = useRenameApp(appId)
    const rename = newName => {
        renameApp(newName)
        setRenaming(false)
    }

    return {
        isRenaming: renaming,
        startRenaming: () => setRenaming(true),
        onRename: rename,
        onCancel: () => setRenaming(false),
    }
}


/**
 * Utility hook for renaming flows. Returns everything you need
 * to rename an app with an EditbaleText component.
 *
 * @export
 * @param {string} flowId
 * @return {{ isRenaming: boolean, startRenaming: () => void, onRename: (newName: string) => void, onCancel: () => void }} 
 */
export function useFlowRenaming(flowId) {
    const [renaming, setRenaming] = useState(false)
    const renameFlow = useRenameFlow(flowId)
    const rename = newName => {
        renameFlow(newName)
        setRenaming(false)
    }

    return {
        isRenaming: renaming,
        startRenaming: () => setRenaming(true),
        onRename: rename,
        onCancel: () => setRenaming(false),
    }
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