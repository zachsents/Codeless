import shortUUID from "short-uuid"


export function createNode(nodeType, position = [0, 0]) {
    return {
        id: `${nodeType.id}_${shortUUID.generate()}`,
        type: nodeType.id,
        data: { 
            state: {}
        },
        position: { x: position[0], y: position[1] }
    }
}