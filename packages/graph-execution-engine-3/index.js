import { Errors, Outputs, Returns } from "./outputs.js"
import { findUnknownTypes, prepGraph, startGraph } from "./util.js"


export async function runFlow({
    nodes,
    edges,
    nodeTypes,
    setupPayload,
}) {
    // clear variables
    global.variables = {}

    // clear trackers
    Outputs.reset()
    Errors.reset()
    Returns.reset()

    // ensure that all node types exist
    findUnknownTypes(nodes, nodeTypes)

    // prep the graph for execution
    prepGraph(nodes, edges, nodeTypes)

    // start the graph execution & wait for graph to finish executing
    await startGraph(nodes, setupPayload)

    return {
        outputs: Outputs.get(),
        errors: Errors.get(),
        returns: Returns.get(),
    }
}
