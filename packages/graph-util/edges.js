import {useStore} from "reactflow"
import { deleteElementsById, shallow } from "./misc.js"


export function createEdge(source, sourceHandle, target, targetHandle) {
    return {
        id: `reactflow__edge-${source}${sourceHandle}-${target}${targetHandle}`,
        source,
        sourceHandle,
        target,
        targetHandle,
        type: "dataEdge",
    }
}


export function deleteEdgeById(rf, edgeId) {
    deleteElementsById(rf, { edgeIds: [edgeId] })
}


export function useConnectedEdges(id) {
    return useStore(
        s => s.edges.filter(edge => edge.target == id || edge.source == id),
        (a, b) => shallow(
            a.map(edge => edge.id),
            b.map(edge => edge.id)
        )
    )
}
