import { prepNode, setupNode, Observable, prepEdge } from "./util.js"

// add a method to Array prototype -- treats single element arrays as
// that object. only used selectively by certain nodes
Array.prototype.untype = function () {
    return this.length == 1 ? this[0] : this
}

// deep flattening
Array.prototype.deepFlat = function () {
    let flattened = this
    while (flattened[0]?.map) {
        flattened = flattened.flat()
    }
    return flattened
}


export function runFlow({
    nodes,
    edges,
    nodeTypes,
    setupPayload,
}) {

    // ensure that all node types exist
    const badType = nodes.find(node => !nodeTypes[node.type])?.type
    if(badType)
        throw new Error(`Couldn't find node type definition for "${badType}". Did you make sure to export it?`)

    // prep the graph for execution
    prepGraph(nodes, edges, nodeTypes)

    // create observable to track when setup is done
    const setupObservable = new Observable()

    // setup nodes
    nodes.forEach(node => setupNode(node, nodeTypes[node.type], setupObservable))

    // fire setup observable
    setupObservable.fire(setupPayload)
}


function prepGraph(nodes, edges, nodeTypes) {
    edges.forEach(
        edge => prepEdge(edge)
    )
    nodes.forEach(
        node => prepNode(node, nodeTypes[node.type], nodes, edges)
    )
}

export { loadNodeTypes } from "./nodes/index.js"