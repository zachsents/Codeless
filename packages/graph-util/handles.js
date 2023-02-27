import { useCallback, useEffect, useMemo, useRef } from "react"
import { useReactFlow } from "reactflow"
import { useSetState } from "@mantine/hooks"

import { useConnectedEdges } from "./edges.js"
import { getNodeTypeById } from "./misc.js"
import { useNodeContext } from "./context.js"
import { useNodeState } from "./state.js"
import { _Nodes } from "./index.js"
import produce from "immer"


export const HandleDirection = {
    Input: "input",
    Output: "output",
}


export function useHandleAlignment() {
    const [handleAlignments, setHandleAlignments] = useSetState({})
    const headerRef = useRef()

    const alignHandles = useCallback((handleNames, el = "header") => {

        if (el == null)
            return
        const alignEl = el === "header" ? headerRef.current : el

        const alignHandle = handleName => {
            if (handleAlignments[handleName] != alignEl)
                setHandleAlignments({ [handleName]: alignEl })
        }

        (typeof handleNames === "string" ? [handleNames] : handleNames)
            .forEach(alignHandle)
    }, [headerRef.current, handleAlignments, setHandleAlignments])

    return [handleAlignments, alignHandles, headerRef]
}


export function useAlignHandles() {

    const { alignHandles } = useNodeContext()

    return useCallback(
        handleName => el => alignHandles(handleName, el),
        [alignHandles]
    )
}


export function useNodeConnections(id, { nodeType: providedNodeType } = {}) {

    const rf = useReactFlow()
    const connectedEdges = useConnectedEdges(id)

    const nodeType = providedNodeType ?? getNodeTypeById(rf, id)

    return useMemo(() => {
        // find connected edges
        const connectedInputHandles = connectedEdges.filter(edge => edge.target == id)
            .map(edge => edge.targetHandle)
        const connectedOutputHandles = connectedEdges.filter(edge => edge.source == id)
            .map(edge => edge.sourceHandle)

        // create a map of handles to connection state
        const inputConns = Object.fromEntries(
            (nodeType?.inputs ?? []).map(handle => [handle.name ?? handle, false])
        )
        const outputConns = Object.fromEntries(
            (nodeType?.outputs ?? []).map(handle => [handle.name ?? handle, false])
        )
        connectedInputHandles.forEach(handle => inputConns[handle] = true)
        connectedOutputHandles.forEach(handle => outputConns[handle] = true)

        return [inputConns, outputConns]
    }, [connectedEdges])
}


export function useListHandle(nodeId, handleName) {

    // if no ID is provided, we'll use the one from the context
    if (!nodeId)
        ({ id: nodeId } = useNodeContext())

    const rf = useReactFlow()

    const [state, setState] = useNodeState(nodeId)
    const labelsKey = `_${handleName}Labels`

    const setLabels = newLabels => {
        setState({ [labelsKey]: newLabels })
    }

    // remove old edges
    useEffect(() => {
        state[labelsKey] && rf.setEdges(produce(draft => {
            const nodeEdges = draft.filter(edge => edge.target == nodeId || edge.source == nodeId)
            
            for (let i = nodeEdges.length - 1; i >= 0; i--) {
                const handleKey = nodeEdges[i].target == nodeId ? "targetHandle" : "sourceHandle"
                const parsed = parseListHandle(nodeEdges[i][handleKey])

                // only this handle             and no non-list handles
                if(parsed.name != handleName || parsed.index === undefined)
                    continue

                // if there's no matching label, remove edge
                if(!state[labelsKey]?.find(label => label.id == parsed.index))
                    draft.splice(i, 1)
            }
        }))
    }, [state[labelsKey]])


    return [state[labelsKey], setLabels]
}



export function parseListHandle(id) {
    const [, name, index] = id.match(/(.+?)(?:\.(\w+))?$/) ?? []
    return {
        name,
        index,
    }
}


export function longhandHandle(handle) {
    const handleObj = typeof handle === "string" ? { name: handle } : handle

    handleObj.label ??= formatHandleName(handleObj.name)
    handleObj.list ??= false

    return handleObj
}


export function formatHandleName(handleName) {

    if (handleName.startsWith("_"))
        return ""

    return handleName
        .replace("$", "")
        .trim()
        .match(/[A-Z]?[^A-Z]+/g)
        ?.map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
        .join(" ") ?? ""
}


export function getHandleLabel(nodeType, handleName) {
    return _Nodes[nodeType].inputs?.map(input => longhandHandle(input))
        .find(input => input.name == handleName)?.label
}