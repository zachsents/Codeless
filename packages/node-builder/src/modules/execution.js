import { runFlow } from "@minus/gee2"
// import NodeTypes from "../modules/nodeTypes"

console.debug("[Execution] Worker is running")

onmessage = async event => {
    console.debug("[Execution] Starting flow")
    const { nodes, edges, setupPayload, nodeTypes } = event.data
    runFlow({
        nodes,
        edges,
        nodeTypes,
        setupPayload,
    })
}