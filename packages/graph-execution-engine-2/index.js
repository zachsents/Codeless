import { prepNode, setupNode, Observable, prepEdge } from "./util.js"

export function runFlow({
    nodes,
    edges,
    nodeTypes,
    setupPayload = {},
}) {

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