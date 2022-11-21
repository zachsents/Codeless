import { useEffect } from "react"
import { produce } from "immer"
import shortUUID from "short-uuid"
import { applyEdgeChanges, applyNodeChanges, getConnectedEdges, useReactFlow } from "reactflow"


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



export function useNodeState(nodeId) {

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

    // set initial state
    // useEffect(() => {
    //     Object.keys(state) == 0 && setState(initial, true)
    // }, [])

    return [state ?? {}, setState]
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