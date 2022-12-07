import { useEffect, useMemo } from "react"
import { produce } from "immer"
import shortUUID from "short-uuid"
import { applyEdgeChanges, applyNodeChanges, getConnectedEdges, useNodes, useReactFlow } from "reactflow"
import { useNodeBuilder } from "./components/NodeBuilder"


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



export function useNodeState(nodeId, defaultState) {

    const reactFlow = useReactFlow()
    const state = reactFlow.getNode(nodeId)?.data.state

    const setState = (changes, overwrite = false) => reactFlow.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

            if (!node) {
                console.log("Couldn't find node:", nodeId)
                return
            }

            if (!node.data)
                node.data = { state: {} }

            if (!node.data.state)
                node.data.state = {}

            node.data.state = {
                ...(!overwrite && node.data.state),
                ...changes,
            }
        })
    )

    // set default state
    useEffect(() => {
        if (defaultState) {
            const changeObject = Object.keys(defaultState).reduce(
                (accum, key) => state?.[key] === undefined ?
                    { ...accum, [key]: defaultState[key] } :
                    accum,
                {}
            )

            setState(changeObject)
        }
    }, [defaultState])

    return [state, setState]
}


export function useNodeData(nodeId) {

    const reactFlow = useReactFlow()
    const data = reactFlow.getNode(nodeId)?.data

    const setData = changes => reactFlow.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

            if (!node) {
                console.log("Couldn't find node:", nodeId)
                return
            }

            if (!node.data)
                node.data = { state: {} }

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
    const { nodeTypes, flowId, appId, firestore } = useNodeBuilder()

    const node = rf.getNode(id)
    const nodeType = nodeTypes[node?.type]

    const [state, setState] = useNodeState(id, nodeType?.defaultState)

    // pass connection state to node
    const connections = useMemo(() => {
        if (!node)
            return {}

        // find connected edges
        const connectedEdges = getConnectedEdges([node], rf.getEdges())
            .map(edge => new Handle(edge.targetHandle).name)

        // create a map of value target handles to connection state
        const entries = nodeType.valueTargets?.map(vt => [vt, connectedEdges.includes(vt)])
        return entries ? Object.fromEntries(entries) : {}
    }, [JSON.stringify(rf.getEdges())])

    return {
        state,
        setState,
        defaultState: nodeType?.defaultState,
        flowId,
        appId,
        connections,
        firestore,
    }
}

export function useNodeType({ id, type }) {
    const { nodeTypes } = useNodeBuilder()

    if (id) {
        const rf = useReactFlow()
        return nodeTypes[rf.getNode(id).type]
    }

    if (type)
        return nodeTypes[type]
}


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

export class Handle {
    constructor(handleId) {
        const split = handleId.match(/\<([\w\W]*?)\>(.*)/)
        this.dataType = split?.[1]
        this.name = split?.[2]
    }
}

export class Getter {
    constructor(get) {
        this.get = get
    }
}