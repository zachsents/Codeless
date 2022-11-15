
function getNode(nodeId, nodes) {
    return nodes.find(node => node.id == nodeId)
}

function getConnectedHandles(nodeId, handleName, nodes, edges) {
    return edges
        .filter(edge =>
            (edge.target == nodeId && edge.targetHandle == handleName) ||
            (edge.source == nodeId && edge.sourceHandle == handleName)
        )
        .map(edge =>
            edge.target == nodeId ? {
                node: getNode(edge.source, nodes),
                handle: edge.sourceHandle
            } : {
                node: getNode(edge.target, nodes),
                handle: edge.targetHandle
            }
        )
}

export function setupNode(node, nodeType, setupObservable) {
    nodeType.setup?.bind(node)(setupObservable)
}

export function prepNode(node, nodeType, nodes, edges) {
    prepValueSources(node, nodeType, nodes, edges)
    prepValueTargets(node, nodeType, nodes, edges)
    prepSignalTargets(node, nodeType, nodes, edges)
    prepSignalSources(node, nodeType, nodes, edges)
}

export function prepValueSources(node, nodeType, nodes, edges) {
    // create getters for value sources
    nodeType?.sources?.values &&
        Object.entries(nodeType.sources.values).forEach(([handleName, valueSourceData]) => {
            Object.defineProperty(node, handleName, {
                get() {
                    const result = valueSourceData?.get.bind(node)()
                    return result.length == 1 ? result[0] : result
                }
            })
        })
}

export function prepValueTargets(node, nodeType, nodes, edges) {
    // create getters for value targets
    nodeType?.targets?.values &&
        Object.entries(nodeType.targets.values).forEach(([handleName, valueTargetData]) => {

            const connectedHandles = getConnectedHandles(node.id, handleName, nodes, edges)

            Object.defineProperty(node, handleName, {
                get() {
                    return connectedHandles.map(connected => connected.node[connected.handle])
                }
            })
        })
}

export function prepSignalTargets(node, nodeType, nodes, edges) {
    // create actions for signal targets
    nodeType?.targets?.signals &&
        Object.entries(nodeType.targets.signals).forEach(([handleName, signalTargetData]) => {
            node[handleName] = signalTargetData.action.bind(node)
        })
}

export function prepSignalSources(node, nodeType, nodes, edges) {
    // create actions for signal sources
    nodeType?.sources?.signals &&
        Object.entries(nodeType.sources.signals).forEach(([handleName, signalSourceData]) => {

            const connectedHandles = getConnectedHandles(node.id, handleName, nodes, edges)

            node[handleName] = signal => {
                connectedHandles.forEach(
                    connected => connected.node[connected.handle](signal)
                )
            }
        })
}

export class Observable {
    constructor() {
        this.subscribers = []
    }

    subscribe(func) {
        this.subscribers.push(func)
    }

    fire(...args) {
        this.subscribers.forEach(subscriber => subscriber(...args))
    }
}

export function prepEdge(edge) {
    edge.sourceHandle = parseHandleId(edge.sourceHandle)
    edge.targetHandle = parseHandleId(edge.targetHandle)
}

function parseHandleId(id) {
    return id.match(/\<([\w\W]*?)\>(.*)/)?.[2] ?? id
}
