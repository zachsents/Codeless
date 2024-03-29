import { useCallback } from "react"
import { useQuery } from "react-query"
import { createFlow, createFlowsForAppQuery, createOtherRunnableFlowsQuery, createRunnableFlowsQuery, deleteFlow, getFlow, getFlowCountForApp, getFlowGraph, getFlowGraphRef, getFlowRef, getFlowsForApp, getNodeSuggestions, getOtherRunnableFlows, publishFlow, renameFlow, unpublishFlow, updateFlowGraph, updateFlowLastEdited } from "./flow-actions.js"
import { useRealtime } from "./firestore-util.js"
import { useCallbackWithRequirements } from "./util.js"


/**
 * Hook that queries flow details.
 *
 * @export
 * @param {string} flowId
 */
export function useFlow(flowId) {

    const { data: flow, ...result } = useQuery(
        ["flow", flowId],
        () => getFlow(flowId)
    )

    return { flow, ...result }
}


/**
 * Hook that gets a flow graph.
 *
 * @export
 * @param {string} flowGraphId
 */
export function useFlowGraph(flowGraphId) {

    const { data: flowGraph, ...result } = useQuery(
        ["flowGraph", flowGraphId],
        () => getFlowGraph(flowGraphId)
    )

    return { flowGraph, ...result }
}


/**
 * Hook that provides a real-time updated state object containing
 * flow details. 
 *
 * @export
 * @param {string} flowId
 */
export function useFlowRealtime(flowId) {
    return useRealtime(getFlowRef(flowId))
}


/**
 * Hook that provides a real-time updated state object containing the
 * flow graph.
 *
 * @export
 * @param {string} flowGraphId
 */
export function useFlowGraphRealtime(flowGraphId) {
    return useRealtime(getFlowGraphRef(flowGraphId))
}


/**
 * Hook that creates a callback that creates a flow for the given
 * app.
 *
 * @export
 * @param {string} appId
 */
export function useCreateFlow(appId) {
    return useCallbackWithRequirements(
        details => createFlow({
            appId,
            ...details,
        }),
        [appId]
    )
}


/**
 * Hook that creates a callback that renames a flow.
 *
 * @export
 * @param {string} flowId
 */
export function useRenameFlow(flowId) {
    return useCallback(
        newName => renameFlow(flowId, newName),
        [flowId]
    )
}


/**
 * Hook that creates a callback that deletes a flow.
 *
 * @export
 * @param {string} flowId
 */
export function useDeleteFlow(flowId) {
    return useCallback(
        () => deleteFlow(flowId),
        [flowId]
    )
}


/**
 * Hook that creates a callback that publishes a flow.
 *
 * @export
 * @param {string} flowId
 */
export function usePublishFlow(flowId) {
    return useCallback(
        () => publishFlow(flowId),
        [flowId]
    )
}


/**
 * Hook that creates a callback that unpublishes a flow.
 *
 * @export
 * @param {string} flowId
 */
export function useUnpublishFlow(flowId) {
    return useCallback(
        () => unpublishFlow(flowId),
        [flowId]
    )
}


/**
 * Hook that creates a callback that updates a flow graph.
 *
 * @export
 * @param {string} flowGraphId
 */
export function useUpdateFlowGraph(flowGraphId) {
    return useCallback(
        newGraph => updateFlowGraph(flowGraphId, newGraph),
        [flowGraphId]
    )
}


/**
 * Hook that creates a callback that updates a flow's
 * lastEdited field.
 *
 * @export
 * @param {string} flowId
 */
export function useUpdateFlowLastEdited(flowId) {
    return useCallback(
        lastEdited => updateFlowLastEdited(flowId, lastEdited),
        [flowId]
    )
}


/**
 * Hook that lists flows for a given app.
 *
 * @export
 * @param {string} appId
 */
export function useFlowsForApp(appId) {
    const { data: flows, ...result } = useQuery(
        ["flowsForApp", appId],
        () => getFlowsForApp(appId)
    )

    return { flows, ...result }
}


/**
 * Hook that provides a real-time list of flows for a given app.
 *
 * @export
 * @param {string} appId
 */
export function useFlowsForAppRealtime(appId) {
    return useRealtime(createFlowsForAppQuery(appId))
}


/**
 * Hook that counts flows for a given app.
 *
 * @export
 * @param {string} appId
 */
export function useFlowCountForApp(appId) {
    const { data: flowCount, ...result } = useQuery(
        ["flowCountForApp", appId],
        () => getFlowCountForApp(appId)
    )

    return { flowCount, ...result }
}


/**
 * Hook that lists flows flows that can be run manually, 
 * excluding the one given.
 *
 * @export
 * @param {string} flowId
 */
export function useOtherRunnableFlows(flowId) {
    const { data: flows, ...result } = useQuery(
        ["otherRunnableFlows", flowId],
        () => getOtherRunnableFlows(flowId)
    )

    return { flows, ...result }
}


/**
 * Hook that provides a real-time list of flows flows that
 * can be run manually, including the one given.
 *
 * @export
 * @param {string} flowId
 * @param {string} appId
 */
export function useRunnableFlowsRealtime(flowId, appId) {
    return useRealtime(createRunnableFlowsQuery(flowId, appId))
}


/**
 * Hook that provides a real-time list of flows flows that
 * can be run manually, excluding the one given.
 *
 * @export
 * @param {string} flowId
 * @param {string} appId
 */
export function useOtherRunnableFlowsRealtime(flowId, appId) {
    return useRealtime(createOtherRunnableFlowsQuery(flowId, appId))
}


/**
 * Hook that gives suggestions for node handles.
 *
 * @export
 * @param {string} typeDefId
 */
export function useNodeSuggestions(typeDefId) {
    return useQuery(
        ["node-suggestions", typeDefId],
        () => getNodeSuggestions(typeDefId)
    )
}