import shortUUID from "short-uuid"


export function createNode(nodeType, position) {
    return {
        id: `${nodeType}_${shortUUID.generate()}`,
        type: nodeType,
        data: { 
            state: {}
        },
        position,
    }
}