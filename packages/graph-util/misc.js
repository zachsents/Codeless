import { _Integrations, _Nodes } from "./index.js"


export function getNodeType(node) {
    return node && _Nodes[node.type]
}


export function getNodeTypeById(rf, nodeId) {
    return _Nodes[rf.getNode(nodeId)?.type]
}


export function getNodeIntegrationsStatus(nodeType, appIntegrations) {
    return nodeType.requiredIntegrations?.map(intId => ({
        ..._Integrations[intId],
        status: appIntegrations[intId] ?? {},
    })) ?? []
}


export function deleteElementsById(rf, { nodeIds = [], edgeIds = [] } = {}) {
    rf.deleteElements({
        nodes: nodeIds.map(id => rf.getNode(id)),
        edges: edgeIds.map(id => rf.getEdge(id)),
    })
}


export function shallow(a, b) {
    if (a instanceof Array && b instanceof Array) {
        return a.every((_a, i) => _a === b[i]) && b.every((_b, i) => _b === a[i])
    }

    if (typeof a != typeof b)
        return false

    if (typeof a === "object") {
        const sort = (c, d) => c[0].localeCompare(d[0])
        const sortedA = Object.entries(a).sort(sort)
        const sortedB = Object.entries(b).sort(sort)
        const keys = entries => entries.map(e => e[0])
        const values = entries => entries.map(e => e[1])
        return shallow(keys(sortedA), keys(sortedB)) && shallow(values(sortedA), values(sortedB))
    }

    return a == b
}