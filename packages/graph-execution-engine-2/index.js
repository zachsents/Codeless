import { prepNode, setupNode, prepEdge } from "./util.js"


export async function runFlow({
    nodes,
    edges,
    nodeTypes,
    setupPayload,
}) {

    // ensure that all node types exist
    const badType = nodes.find(node => !nodeTypes[node.type])?.type
    if (badType)
        throw new Error(`Couldn't find node type definition for "${badType}". Did you make sure to export it?`)

    // prep the graph for execution
    prepGraph(nodes, edges, nodeTypes)

    // wait for graph to finish executing
    await Promise.all(
        nodes
            // prep setup functions
            .map(node => setupNode(node, nodeTypes[node.type]))
            // call setup functions
            .map(setupFunction => setupFunction?.(setupPayload))
    )
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