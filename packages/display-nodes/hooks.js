import { useEffect, useState } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { collection, documentId, getDocs, query, where } from "firebase/firestore"


export function useOtherFlows({ appId, flowId, firestore, setFlow }) {

    // grab schedulable flows that aren't this one
    const [otherFlows, setOtherFlows] = useState([])
    useEffect(() => {
        appId && flowId &&
            getDocs(
                query(
                    collection(firestore, `apps/${appId}/flows`),
                    where(documentId(), "!=", flowId),
                    where("trigger", "==", "basic:DefaultTrigger")
                )
            )
                .then(result => {
                    setOtherFlows(result.docs.map(doc => ({
                        value: doc.id,
                        label: doc.data().name,
                    })))
                })
    }, [appId, flowId])

    // if there's only one other flow, set it
    useEffect(() => {
        if (otherFlows.length == 1)
            setFlow(otherFlows[0].value)
    }, [otherFlows])

    return [otherFlows]
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