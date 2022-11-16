import { useEffect } from "react"
import { produce } from "immer"
import { getConnectedEdges, useReactFlow } from "reactflow"


export function validateEdgeConnection(connection, edges) {
    // only connect when handles have matching data types
    const sourceHandle = new Handle(connection.sourceHandle)
    const targetHandle = new Handle(connection.targetHandle)
    const sameDataType = sourceHandle.dataType == targetHandle.dataType

    // if all tests are passed, make the connection
    return sameDataType && sourceHandle.dataType
}



export function useNodeState(nodeId, initial = {}) {

    const reactFlow = useReactFlow()
    const state = reactFlow.getNode(nodeId).data.state

    const setState = (changes, overwrite = false) => reactFlow.setNodes(nodes =>
        produce(nodes, draft => {
            const node = draft.find(node => node.id == nodeId)

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
    useEffect(() => {
        Object.keys(state) == 0 && setState(initial, true)
    }, [])

    return [state ?? {}, setState]
}

export function removeNode(nodeId, reactFlow) {
    const node = reactFlow.getNode(nodeId)
    const connectedEdges = getConnectedEdges([node], reactFlow.getEdges())
        .map(edge => edge.id)
    reactFlow.setEdges(edges => edges.filter(edge => !connectedEdges.includes(edge.id)))
    reactFlow.setNodes(nodes => nodes.filter(node => node.id != nodeId))
}

export function removeEdge(edgeId, reactFlow) {
    reactFlow.setEdges(edges => edges.filter(edge => edge.id != edgeId))
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