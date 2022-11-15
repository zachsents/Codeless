import { runFlow } from "graph-execution-engine-2"
// import NodeTypes from "../modules/nodeTypes"

console.debug("[Execution] Worker is running")

onmessage = async event => {
    console.debug("[Execution] Starting flow")
    const { nodes, edges, setupPayload } = event.data
    runFlow({
        nodes,
        edges,
        nodeTypes: NodeTypes,
        setupPayload,
    })
}