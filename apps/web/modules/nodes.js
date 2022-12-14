import { 
    Nodes as OtherNodes, 
    NodeCategories as OtherNodeCategories,
    Triggers
} from "@minus/client-nodes"


export const Nodes = {
    ...OtherNodes,
    ...Triggers,
}

export const NodeCategories = Object.values(OtherNodeCategories).map(cat => ({
    ...cat,
    nodes: cat.members.map(member => Nodes[member]),
}))
