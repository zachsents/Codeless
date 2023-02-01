import { clearErrors, getErrors } from "./errors.js"
import { subscribe } from "./promiseStream.js"
import { findUnknownTypes, prepGraph, startGraph } from "./util.js"


export async function runFlow({
    nodes,
    edges,
    nodeTypes,
    setupPayload,
}) {
    // clear variables
    global.variables = {}

    // clear errors
    clearErrors()

    // ensure that all node types exist
    findUnknownTypes(nodes, nodeTypes)

    // prep the graph for execution
    prepGraph(nodes, edges, nodeTypes)

    // start the graph execution
    startGraph(nodes, setupPayload)

    // wait for graph to finish executing
    await subscribe()

    return { errors: getErrors() }
}
