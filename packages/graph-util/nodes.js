import { applyNodeChanges } from "reactflow"
import { alphanumeric } from "nanoid-dictionary"
import { customAlphabet } from "nanoid"

import { HandleDirection } from "./handles.js"
import { createEdge } from "./edges.js"
import { deleteElementsById } from "./misc.js"


const generateId = customAlphabet(alphanumeric, 10)


export function createNode(typeId, position) {
    return {
        id: `${typeId}_${generateId()}`,
        type: typeId,
        data: {
            state: {}
        },
        position,
        focusable: false,
    }
}


export function addNodeAtCenter(rf, type) {
    // add node at center
    const proj = rf.project({
        x: (window.innerWidth - 240) / 2,
        y: (window.innerHeight - 60) / 2,
    })
    proj.x -= 56 / 2
    proj.y -= 56 / 2
    rf.addNodes(createNode(type, proj))
}


export function addNodesAtCenter(rf, types) {
    // calculate center
    const center = rf.project({
        x: (window.innerWidth - 240) / 2,
        y: (window.innerHeight - 60) / 2,
    })
    center.x -= 56 / 2
    center.y -= 56 / 2

    // create nodes while staggering
    rf.addNodes(
        types.map((type, i) => createNode(type, {
            x: center.x + i * 20,
            y: center.y + i * 20,
        }))
    )
}


export function addNeighborNode(rf, {
    originNodeId,
    originHandle,
    type,
    handle,
    direction,
    topOffset,
} = {}) {

    const { position: { x, y }, width, height } = rf.getNode(originNodeId)
    const xOffset = 150

    const newNode = createNode(type, {
        x: direction == HandleDirection.Input ? x - xOffset - 200 : x + width + xOffset,
        y: y + 2 * (topOffset + 12 - height / 2),
    })

    const newEdge = originHandle && handle && (
        direction == HandleDirection.Input ?
            createEdge(newNode.id, handle, originNodeId, originHandle) :
            createEdge(originNodeId, originHandle, newNode.id, handle)
    )

    rf.addNodes(newNode)
    newEdge && rf.addEdges(newEdge)

    selectNode(rf, newNode.id)
}


export function deleteNodeById(rf, nodeId) {
    deleteElementsById(rf, { nodeIds: [nodeId] })
}


export function selectNode(rf, nodeId, {
    deselectOthers = true,
} = {}) {
    let changes = [{
        id: nodeId,
        type: "select",
        selected: true,
    }]

    if (deselectOthers)
        rf.getNodes().forEach(node => {
            node.id != nodeId && changes.push({
                id: node.id,
                type: "select",
                selected: false,
            })
        })

    rf.setNodes(applyNodeChanges(changes, rf.getNodes()))
}


export function deselectNode(rf, nodeId) {
    rf.setNodes(applyNodeChanges([{
        id: nodeId,
        type: "select",
        selected: false,
    }], rf.getNodes()))
}