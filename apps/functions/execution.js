import MathNodes from "math-nodes"
import PrimitiveNodes from "primitive-nodes"
import UtilityNodes from "utility-nodes"
import MailNodes from "mail-nodes"

import TriggerNodes from "triggers"
import { runFlow } from "graph-execution-engine-2"


/*
    In the future, we can put the dependencies in the graph, then dynamically load
    the modules we need.
*/
const nodeTypes = {
    ...TriggerNodes,
    ...MathNodes,
    ...PrimitiveNodes,
    ...UtilityNodes,
    ...MailNodes,
}


export function executeFlow(graph, payload = {}) {
    try {
        var { nodes, edges } = JSON.parse(graph)
    }
    catch(err) {
        throw new Error("Failed to parse graph.")
    }

    runFlow({ nodes, edges, nodeTypes, setupPayload: payload })
}