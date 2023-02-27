import { useCallback, useEffect } from "react"
import { useReactFlow, useStore } from "reactflow"
import { produce } from "immer"

import { useNodeContext } from "./context.js"
import { getNodeTypeById, shallow } from "./misc.js"


export function useNodeState(nodeId) {

    // if no ID is provided, we'll use the one from the context
    if (!nodeId)
        ({ id: nodeId } = useNodeContext())

    const rf = useReactFlow()
    const state = useStore(s => Object.fromEntries(s.nodeInternals)[nodeId]?.data?.state ?? {}, shallow)

    // setter function
    const setState = useCallback((changes, overwrite = false) => rf.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

            if (!node) {
                console.warn("Couldn't find node:", nodeId)
                return
            }

            node.data ??= {}
            node.data.state ??= {}

            if (overwrite)
                node.data.state = {}

            node.data.state = {
                ...node.data.state,
                ...changes,
            }
        })
    ), [rf])

    // set default state
    useEffect(() => {
        const defaultState = getNodeTypeById(rf, nodeId)?.defaultState

        if (defaultState) {
            const stateChanges = {}
            Object.entries(defaultState).forEach(([key, val]) => {
                if (!(key in state))
                    stateChanges[key] = val
            })

            setState(stateChanges)
        }
    }, [rf, setState])

    return [state, setState]
}


export function useNodeData(nodeId) {

    // if no ID is provided, we'll use the one from the context
    if (!nodeId)
        ({ id: nodeId } = useNodeContext())

    const rf = useReactFlow()
    const data = useStore(s => Object.fromEntries(s.nodeInternals)[nodeId]?.data ?? {}, shallow)

    // setter function
    const setData = useCallback(changes => rf.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

            if (!node) {
                console.warn("Couldn't find node:", nodeId)
                return
            }

            node.data ??= { state: {} }

            node.data = {
                ...node.data,
                ...changes,
            }
        })
    ), [rf])

    return [data, setData]
}