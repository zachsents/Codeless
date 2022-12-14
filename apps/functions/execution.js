import { runFlow } from "@minus/gee2"
/*
    In the future, we can put the dependencies in the graph, then dynamically load
    the modules we need.
*/
import Nodes from "@minus/server-nodes"


export async function executeFlow(graph, payload, globals = {}) {
    try {
        var { nodes, edges } = JSON.parse(graph)
    }
    catch (err) {
        throw new Error("Failed to parse graph.")
    }

    global.info = globals

    return await runFlow({
        nodes,
        edges,
        nodeTypes: Nodes,
        setupPayload: payload
    })
}