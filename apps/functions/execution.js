import { runFlow } from "graph-execution-engine-2"
import TriggerNodes from "triggers"

/*
    In the future, we can put the dependencies in the graph, then dynamically load
    the modules we need.
*/
import Nodes from "@zachsents/nodes"


export function executeFlow(graph, payload = {}) {
    try {
        var { nodes, edges } = JSON.parse(graph)
    }
    catch(err) {
        throw new Error("Failed to parse graph.")
    }

    runFlow({ 
        nodes, 
        edges, 
        nodeTypes: {
            ...Nodes,
            ...TriggerNodes,
        },
        setupPayload: payload 
    })
}