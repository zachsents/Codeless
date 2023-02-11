import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { applyEdgeChanges, applyNodeChanges, getConnectedEdges, useReactFlow, useStore, useUpdateNodeInternals, useViewport } from "reactflow"
import { useInterval, useSetState } from "@mantine/hooks"
import shallow from "zustand/shallow"
import { produce } from "immer"
import shortUUID from "short-uuid"

import { useAppId, useFlowId } from "./hooks"
import { Nodes } from "./nodes"


export function useNodeState(nodeId, defaultState) {

    const rf = useReactFlow()
    const state = useStore(s => Object.fromEntries(s.nodeInternals)[nodeId]?.data?.state)

    const setState = (changes, overwrite = false) => rf.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

            if (!node) {
                console.log("Couldn't find node:", nodeId)
                return
            }

            node.data ??= { state: {} }
            node.data.state ??= {}

            node.data.state = {
                ...(!overwrite && node.data.state),
                ...changes,
            }
        })
    )

    // set default state
    useEffect(() => {
        if (defaultState) {
            setState(produce(defaultState, draft => {
                Object.keys(draft).forEach(key => {
                    if (state?.[key] !== undefined)
                        delete draft[key]
                })
            }))
        }
    }, [defaultState])

    return [state, setState]
}


export function useNodeData(nodeId) {

    const rf = useReactFlow()
    const data = useStore(s => Object.fromEntries(s.nodeInternals)[nodeId]?.data)

    const setData = changes => rf.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

            if (!node) {
                console.log("Couldn't find node:", nodeId)
                return
            }

            node.data ??= { state: {} }

            node.data = {
                ...node.data,
                ...changes,
            }
        })
    )

    return [data, setData]
}


export function useNodeDisplayProps(id) {

    const rf = useReactFlow()

    const appId = useAppId()
    const flowId = useFlowId()

    const node = rf.getNode(id)
    const nodeType = Nodes[node?.type]

    const [state, setState] = useNodeState(id, nodeType?.defaultState)
    const [inputConnections, outputConnections] = useNodeConnections(id, { nodeType: nodeType ?? null })
    const listHandles = useListHandles(id)

    return {
        appId,
        flowId,
        state,
        setState,
        defaultState: nodeType?.defaultState,
        connections: { ...inputConnections, ...outputConnections },
        inputConnections,
        outputConnections,
        listHandles,
    }
}


export function useNodeConnections(id, { nodeType: providedNodeType } = {}) {

    const connectedEdges = useConnectedEdges(id)
    const nodeType = providedNodeType === undefined ? useNodeType({ id }) : providedNodeType

    return useMemo(() => {
        // find connected edges
        const connectedInputHandles = connectedEdges.filter(edge => edge.target == id)
            .map(edge => edge.targetHandle)
        const connectedOutputHandles = connectedEdges.filter(edge => edge.source == id)
            .map(edge => edge.sourceHandle)

        // create a map of value target handles to connection state
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


export function useListHandles(nodeId) {

    const rf = useReactFlow()
    const listHandles = useStore(s => Object.fromEntries(s.nodeInternals)[nodeId]?.data?.listHandles)
    const connectedEdges = useConnectedEdges(nodeId)

    const modifyListHandles = mutator => rf.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

            if (!node) {
                console.log("Couldn't find node:", nodeId)
                return
            }

            node.data ??= { listHandles: {} }
            node.data.listHandles ??= {}

            mutator?.(node.data?.listHandles)
        })
    )

    return {
        handles: listHandles,
        modifyListHandles,
        add: handle => {
            modifyListHandles(draft => {
                draft[handle] ??= 0
                draft[handle]++
            })
        },
        remove: (handle, index) => {
            modifyListHandles(draft => {
                draft[handle] ??= 1
                draft[handle]--
            })

            // fix edges
            rf.setEdges(produce(draft => {
                // find related edges
                const listEdges = draft.filter(edge =>
                    (edge.target == nodeId && parseListHandle(edge.targetHandle).name == handle) ||
                    (edge.source == nodeId && parseListHandle(edge.sourceHandle).name == handle)
                )
                const connectedEdge = listEdges.find(edge =>
                    parseListHandle(edge.target == nodeId ? edge.targetHandle : edge.sourceHandle).index == index
                )

                // remove connected edge
                connectedEdge &&
                    draft.splice(draft.indexOf(connectedEdge), 1)

                // shift up edges beneath the removed one
                listEdges.forEach(edge => {
                    const handleKey = edge.target == nodeId ? "targetHandle" : "sourceHandle"
                    const { name, index: currentIndex } = parseListHandle(edge[handleKey])

                    if (currentIndex > index) {
                        edge[handleKey] = `${name}.${currentIndex - 1}`
                        edge.id = edge.id.replace(
                            `${name}.${currentIndex}`,
                            `${name}.${currentIndex - 1}`
                        )
                    }
                })
            }))
        }
    }
}


export function useConnectedEdges(id) {
    return useStore(
        s => s.edges.filter(edge => edge.target == id || edge.source == id),
        (a, b) => shallow(
            a.map(edge => edge.id),
            b.map(edge => edge.id)
        )
    )
}


export function useNodeType({ id, type }) {

    if (id) {
        const rf = useReactFlow()
        return Nodes[rf.getNode(id).type]
    }

    if (type)
        return Nodes[type]
}


export function useSmoothlyUpdateNode(id, deps = [], {
    interval = 20
} = {}) {
    const updateNodeInterals = useUpdateNodeInternals()
    const nodeUpdateInterval = useInterval(() => {
        updateNodeInterals(id)
    }, interval)
    useEffect(() => {
        nodeUpdateInterval.start()
    }, deps)

    return nodeUpdateInterval.stop
}


export function useNodeMinHeight() {
    const stackRefs = useRef([])
    const addRef = index => el => stackRefs.current[index] = (el?.offsetHeight ?? 0)
    return [
        Math.max(...stackRefs.current),
        addRef
    ]
}


export function useHandleAlignment() {
    const [handleAlignments, setHandleAlignments] = useSetState({})
    const headerRef = useRef()

    const alignHandles = (handleNames, el = "header") => {

        if (el == null)
            return
        const alignEl = el === "header" ? headerRef.current : el

        const alignHandle = handleName => {
            if (handleAlignments[handleName] != alignEl)
                setHandleAlignments({ [handleName]: alignEl })
        }

        (typeof handleNames === "string" ? [handleNames] : handleNames)
            .forEach(alignHandle)
    }

    return [handleAlignments, alignHandles, headerRef]
}


export function useDeleteNode(id, { reactFlow } = {}) {
    const rf = reactFlow ?? useReactFlow()
    return () => {
        removeNode(id, rf)
    }
}


export function useDeleteEdge(id, { reactFlow } = {}) {
    const rf = reactFlow ?? useReactFlow()
    return () => {
        removeEdge(id, rf)
    }
}


export function useNodeScreenPosition(id) {

    useViewport()

    // update when node position changes
    useStore(s => Object.fromEntries(s.nodeInternals)[id]?.position)

    const rfViewportBounds = document.querySelector(".react-flow__renderer")
        .getBoundingClientRect()

    const screen = document.querySelector(`.react-flow__node[data-id="${id}"]`)
        .getBoundingClientRect()

    screen.center = {
        x: screen.x + screen.width / 2,
        y: screen.y + screen.height / 2,
    }

    const viewport = Object.fromEntries(
        ["bottom", "left", "right", "top", "x", "y"]
            .map(key => [key, screen[key] - rfViewportBounds[key]])
    )
    viewport.center = {
        x: screen.center.x - rfViewportBounds.x,
        y: screen.center.y - rfViewportBounds.y,
    }

    return { screen, viewport }
}


export function useNodeSelection(id, { reactFlow } = {}) {
    const rf = reactFlow ?? useReactFlow()

    const selected = useStore(s => Object.fromEntries(s.nodeInternals)[id]?.selected)

    const setSelected = val => {
        rf.setNodes(produce(draft => {
            const node = draft.find(node => node.id == id)
            if (node)
                node.selected = val
        }))
    }

    return [selected, () => setSelected(true), () => setSelected(false), setSelected]
}


export function useNodeDragging(id) {
    const dragging = useStore(s => Object.fromEntries(s.nodeInternals)[id]?.dragging)

    return [dragging]
}


export function useNodeSnapping(id, x, y, {
    reactFlow,
    distance = 10,
    horizontalLookaround = 500,
    preventSnappingKey = "Shift"
} = {}) {
    const rf = reactFlow ?? useReactFlow()

    const [keyPressed, setKeyPressed] = useState(false)

    useEffect(() => {
        const keyDownHandler = event => event.key == preventSnappingKey && setKeyPressed(true)
        const keyUpHandler = event => event.key == preventSnappingKey && setKeyPressed(false)
        window.addEventListener("keydown", keyDownHandler)
        window.addEventListener("keyup", keyUpHandler)
        return () => {
            window.removeEventListener("keydown", keyDownHandler)
            window.removeEventListener("keyup", keyUpHandler)
        }
    }, [])

    useLayoutEffect(() => {
        if (keyPressed)
            return

        // get our center
        const node = rf.getNode(id)
        if (!node)
            return
        const center = {
            x: x + node.width / 2,
            y: y + node.height / 2,
        }

        // find nodes that are eligible to snap to 
        const [closestLeft, closestRight] = rf.getNodes().reduce((closest, node) => {
            // ignore our node
            if (node.id == id)
                return closest

            // get center
            const currentCenter = {
                x: node.position.x + node.width / 2,
                y: node.position.y + node.height / 2,
            }

            // ignore one's outside of vertical snapping distance
            if (Math.abs(currentCenter.y - center.y) > distance)
                return closest

            // ignore ones outside of horizontal lookaround
            if (Math.abs(currentCenter.x - center.x) > horizontalLookaround)
                return closest

            // compare nodes to the left
            if (currentCenter.x < center.x && (!closest[0] || currentCenter.x > closest[0].x))
                return [currentCenter, closest[1]]

            // compare nodes to the right
            if (currentCenter.x > center.x && (!closest[1] || currentCenter.x < closest[1].x))
                return [closest[0], currentCenter]

            return closest
        }, [null, null])

        // find closest
        const closest = closestLeft && closestRight ?
            (Math.abs(closestLeft.y - center.y) < Math.abs(closestRight.y - center.y) ? closestLeft : closestRight) :
            (closestLeft ?? closestRight)

        if (closest) {
            rf.setNodes(produce(draft => {
                const node = draft.find(node => node.id == id)
                node.position.y = closest.y - node.height / 2
            }))
        }

    }, [x, y])
}


/**
 * Node & Edge Actions
 */

export function removeNode(nodeId, reactFlow) {
    removeNodes([nodeId], reactFlow)
}

export function removeNodes(nodeIds, reactFlow) {
    const edgeChanges = getConnectedEdges(
        nodeIds.map(id => reactFlow.getNode(id)),
        reactFlow.getEdges()
    )
        .map(({ id }) => ({ id, type: "remove", }))

    const nodeChanges = nodeIds
        .filter(id => id != "trigger")
        .map(id => ({ id, type: "remove" }))

    reactFlow.setEdges(edges => applyEdgeChanges(edgeChanges, edges))
    reactFlow.setNodes(nodes => applyNodeChanges(nodeChanges, nodes))
}

export function removeEdge(edgeId, reactFlow) {
    removeEdges([edgeId], reactFlow)
}

export function removeEdges(edgeIds, reactFlow) {
    const edgeChanges = edgeIds.map(id => ({ id, type: "remove" }))
    reactFlow.setEdges(edges => applyEdgeChanges(edgeChanges, edges))
}

export function createNode(nodeType, position) {
    // added this offset because that's how far off RF's project function was -- not sure why
    return {
        id: `${nodeType}_${shortUUID.generate()}`,
        type: nodeType,
        data: {
            state: {}
        },
        position,
        focusable: false,
    }
}

export function findEdgeFromConnection(connection, edges) {
    return edges.find(
        edge => edge.source == connection.source && edge.sourceHandle == connection.sourceHandle &&
            edge.target == connection.target && edge.targetHandle == connection.targetHandle
    )
}

export function validateEdgeConnection(connection, edges) {
    // ensure edge doesn't already exist
    // const unique = edges.every(edge =>
    //     edge.source != connection.source ||
    //     edge.sourceHandle != connection.sourceHandle ||
    //     edge.target != connection.target ||
    //     edge.targetHandle != connection.targetHandle
    // )

    // only connect when handles have matching data types
    const sourceHandle = new Handle(connection.sourceHandle)
    const targetHandle = new Handle(connection.targetHandle)
    const sameDataType = sourceHandle.dataType == targetHandle.dataType

    // if all tests are passed, make the connection
    return sameDataType && sourceHandle.dataType
}

export function getNodeElement(id) {
    return document.querySelector(`.react-flow__node[data-id="${id}"]`)
}


/**
 * Special Utilities
 */

export function serializeGraph(nodes = [], edges = []) {
    return JSON.stringify({
        nodes: nodes.map(node => ({ ...node, state: node.data.state, })),
        edges
    })
}

export function deserializeGraph(str = "{}") {
    const { nodes, edges } = JSON.parse(str)
    return { nodes, edges }
}

export function parseListHandle(id) {
    const [, name, index] = id.match(/(.+?)(?:\.(\d+))?$/) ?? []
    return {
        name,
        index: parseInt(index),
    }
}

export class Handle {
    constructor(handleId) {
        const split = handleId.match(/\<([\w\W]*?)\>(.*)/)
        this.dataType = split?.[1]
        this.name = split?.[2]
    }
}