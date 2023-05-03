

export function generateGraph(string = "", nodeStates = {}) {
    const nodes = []

    const matches = [...(string.matchAll(/^(.+?)\.(\S+)\s*->\s*(.+?)\.(\S+)$/gm) ?? [])]

    // function to either find or insert a node
    const upsertNode = (nodeId) => {
        if (!nodes.find(node => node.id == nodeId))
            nodes.push({
                id: nodeId,
                type: nodeId.match(/.+(?=_)/)?.[0],
                data: { state: nodeStates[nodeId] ?? {} },
            })
    }

    // create edges
    const edges = matches.map(match => {
        const [, source, sourceHandle, target, targetHandle] = match
        upsertNode(source)
        upsertNode(target)

        return { source, sourceHandle, target, targetHandle }
    })    

    return JSON.stringify({ nodes, edges })
}

