import { useEffect, useMemo, useState } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { useOtherRunnableFlowsRealtime } from "@minus/client-sdk"


export function useOtherFlows(flowId, appId, setFlow) {

    // grab schedulable flows that aren't this one
    const [otherFlows] = useOtherRunnableFlowsRealtime(flowId, appId)

    // transform to what Mantine Selects like
    const otherFlowsData = useMemo(
        () => otherFlows?.map(flow => ({
            value: flow.id,
            label: flow.name,
        })),
        [otherFlows]
    )

    // if there's only one other flow, set it
    useEffect(() => {
        if (otherFlowsData?.length == 1)
            setFlow(otherFlowsData[0].value)
    }, [otherFlowsData])

    return [otherFlowsData]
}


export function useDebouncedSynchronizedState(state, setState, debounce) {
    const [instantState, setInstantState] = useState(state)

    // Sync: instant state -> debounced
    const [debouncedState] = useDebouncedValue(instantState, debounce)

    // Sync: debounced -> upper state
    useEffect(() => {
        debouncedState != state && setState(debouncedState)
    }, [debouncedState])

    // Sync: upper state -> instant state
    useEffect(() => {
        state != instantState && setInstantState(state)
    }, [state])

    return [instantState, setInstantState]
}


/**
 * Syncs the state of each entry in an object with the state of a node.
 *
 * @export
 * @param {object} items
 * @param {Function} setState
 */
export function useSyncWithNodeState(items, setState) {
    Object.entries(items).forEach(([key, val]) => {
        useEffect(() => {
            setState({ [key]: val })
        }, [val])
    })
}