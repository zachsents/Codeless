import { useEffect } from "react"
import { getConnectedEdges, useReactFlow } from "reactflow"


export function validateEdgeConnection(connection, edges) {
    // only connect when handles have matching data types
    const sourceHandle = new Handle(connection.sourceHandle)
    const targetHandle = new Handle(connection.targetHandle)
    const sameDataType = sourceHandle.dataType == targetHandle.dataType

    // if all tests are passed, make the connection
    return sameDataType
}

export function useNodeState(nodeId, initial = {}) {
    const reactFlow = useReactFlow()

    const state = reactFlow.getNode(nodeId).data.state

    const setState = (changes, overwrite = false) => reactFlow.setNodes(nodes => nodes.map(node =>
        node.id == nodeId ?
            {
                ...node,
                data: {
                    ...node.data,
                    state: overwrite ? changes : {
                        ...node.data.state,
                        ...changes
                    }
                }
            } : node
    ))

    useEffect(() => {
        Object.keys(state) == 0 && setState(initial, true)
    }, [])

    return [state || {}, setState]
}

export function setNodeState(nodeId, value, reactFlow) {
    reactFlow.setNodes(nodes => nodes.map(node => {
        if (node.id == nodeId)
            node.data.state = value
        return node
    }))
}

export function setNodeProps(nodeId, changeObject, reactFlow) {
    reactFlow.setNodes(nodes => nodes.map(node => {
        if (node.id == nodeId)
            node.data.state = {
                ...node.data.state,
                ...changeObject
            }
        return node
    }))
}

export function setNodeProp(nodeId, propName, propValue, reactFlow) {
    setNodeProps(nodeId, {
        [propName]: propValue
    }, reactFlow)
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

export function getInputValues(node, reactFlow, supplementalKeys = []) {
    return Object.fromEntries([
        ...supplementalKeys.map(key => [key, undefined]),
        ...getConnectedEdges([node], reactFlow.getEdges())
            .filter(edge => edge.target == node.id)
            .map(edge => {
                const targetHandle = new Handle(edge.targetHandle)
                const sourceHandle = new Handle(edge.sourceHandle)
                const data = reactFlow.getNode(edge.source)?.data[sourceHandle.name]
                return [
                    targetHandle.name,
                    data instanceof Getter ? data.get() : data
                ]
            })
    ])
}

export function getOutputValues(node, reactFlow) {
    const outputs = {}
    getConnectedEdges([node], reactFlow.getEdges())
        .filter(edge => edge.source == node.id)
        .forEach(edge => {
            const targetHandle = new Handle(edge.targetHandle)
            const sourceHandle = new Handle(edge.sourceHandle)
            const output = reactFlow.getNode(edge.target)?.data[targetHandle.name]

            outputs[sourceHandle.name]?.push(output) ||
                (outputs[sourceHandle.name] = [output])
        })
    return outputs
}

export function getActionsFire(node, handle, reactFlow) {
    const actions = getOutputValues(node, reactFlow)[handle]
    return _ => actions?.forEach(action => action?.(_))
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