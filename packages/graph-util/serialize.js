

export function serializeGraph(nodes = [], edges = []) {
    return JSON.stringify({
        nodes: nodes.map(node => ({ ...node, state: node.data.state, })),
        edges
    })
}


export function deserializeGraph(str = "{}") {
    const { nodes, edges } = JSON.parse(str)
    return { nodes, edges }
}