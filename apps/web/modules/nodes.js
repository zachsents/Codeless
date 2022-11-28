import { Nodes as DisplayNodes, NodeCategories as DisplayNodeCategories } from "@zachsents/display-nodes"
import TriggerNodes from "triggers/display"


export const Nodes = addIdToNodes({
    ...DisplayNodes,
    ...TriggerNodes,
})


export const NodeCategories = Object.values(DisplayNodeCategories).map(cat => ({
    ...cat,
    nodes: cat.members.map(member => Nodes[member]),
}))


function addIdToNodes(nodesObj) {
    return Object.fromEntries(
        Object.entries(nodesObj).map(
            ([id, data]) => [id, { ...data, id, }]
        )
    )
}