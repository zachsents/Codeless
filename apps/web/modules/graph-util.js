import { useInterval } from "@mantine/hooks"
import { produce } from "immer"
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { applyNodeChanges, useReactFlow, useStore, useUpdateNodeInternals, useViewport } from "reactflow"
import shortUUID from "short-uuid"
import shallow from "zustand/shallow"

import { Group, Text, Title } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import { Integrations, NodeDefinitions } from "@minus/client-nodes"
import { HandleType, useNodeId, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"


export function useNodeConnections(id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    id ??= useNodeId()

    const typeDefinition = useTypeDefinition(id)
    const connectedEdges = useConnectedEdges(id)

    return useMemo(() => {
        // find connected edges
        const connectedInputHandles = connectedEdges.filter(edge => edge.target == id)
            .map(edge => edge.targetHandle)
        const connectedOutputHandles = connectedEdges.filter(edge => edge.source == id)
            .map(edge => edge.sourceHandle)

        // create a map of value target handles to connection state
        const inputConns = Object.fromEntries(
            (typeDefinition?.inputs ?? []).map(handle => [handle.name ?? handle, false])
        )
        const outputConns = Object.fromEntries(
            (typeDefinition?.outputs ?? []).map(handle => [handle.name ?? handle, false])
        )
        connectedInputHandles.forEach(handle => inputConns[handle] = true)
        connectedOutputHandles.forEach(handle => outputConns[handle] = true)

        return [inputConns, outputConns]
    }, [connectedEdges])
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


/**
 * Hook that provides a function to update the rendering of
 * a node.
 *
 * @export
 * @param {string} [id]
 * @return {() => void} 
 */
export function useUpdateNode(id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    id ??= useNodeId()
    const updateNodeInterals = useUpdateNodeInternals()
    return useCallback(() => updateNodeInterals(id), [id])
}


/**
 * Hook that smoothly updates a node's rendering at a given interval.
 * Optionally, the interval can be stopped after a given timeout. This
 * is useful when a node or handle transitions its size or position.
 *
 * @export
 * @param {string} [id]
 * @param {*[]} [deps=[]]
 * @param {Object} options
 * @param {number} [options.interval=20]
 * @param {number} [options.timeout]
 * @return {() => void} 
 */
export function useSmoothlyUpdateNode(id, deps = [], {
    interval = 20,
    timeout,
} = {}) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    id ??= useNodeId()

    const updateNodeInterals = useUpdateNodeInternals()

    const nodeUpdateInterval = useInterval(() => {
        updateNodeInterals(id)
    }, interval)

    // start interval when dependencies change
    useEffect(() => {
        nodeUpdateInterval.start()
    }, deps)

    // when interval is started, stop it after timeout
    useEffect(() => {
        if (nodeUpdateInterval.active && timeout != null)
            setTimeout(nodeUpdateInterval.stop, timeout)
    }, [nodeUpdateInterval.active])

    return nodeUpdateInterval.stop
}


/**
 * Hook that provides the position of a node in the viewport.
 *
 * @export
 * @param {string} [id]
 * @return {{ screen: DOMRect, viewport: Object }} 
 */
export function useNodeScreenPosition(id) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    id ??= useNodeId()

    useViewport()

    // update when node position changes
    useStore(s => Object.fromEntries(s.nodeInternals)[id]?.position)

    const rfViewportBounds = document.querySelector(".react-flow__renderer")
        .getBoundingClientRect()

    const screen = document.querySelector(`.react-flow__node[data-id="${id}"]`)
        .getBoundingClientRect()

    screen.center = {
        x: screen.x + screen.width / 2,
        y: screen.y + screen.height / 2,
    }

    const viewport = Object.fromEntries(
        ["bottom", "left", "right", "top", "x", "y"]
            .map(key => [key, screen[key] - rfViewportBounds[key]])
    )
    viewport.center = {
        x: screen.center.x - rfViewportBounds.x,
        y: screen.center.y - rfViewportBounds.y,
    }

    return { screen, viewport }
}


/**
 * Hook that provides logic for snapping nodes to other nodes
 * horizontally.
 *
 * @export
 * @param {string} [id]
 * @param {number} x
 * @param {number} y
 * @param {Object} [options]
 * @param {import("reactflow").ReactFlowInstance} [options.reactFlow]
 * @param {number} [options.distance=10]
 * @param {number} [options.horizontalLookaround=500]
 * @param {string} [options.preventSnappingKey="Shift"]
 */
export function useNodeSnapping(id, x, y, {
    reactFlow,
    distance = 10,
    horizontalLookaround = 500,
    preventSnappingKey = "Shift"
} = {}) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    id ??= useNodeId()

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rf = reactFlow ?? useReactFlow()

    const [keyPressed, setKeyPressed] = useState(false)

    useEffect(() => {
        const keyDownHandler = event => event.key == preventSnappingKey && setKeyPressed(true)
        const keyUpHandler = event => event.key == preventSnappingKey && setKeyPressed(false)
        window.addEventListener("keydown", keyDownHandler)
        window.addEventListener("keyup", keyUpHandler)
        return () => {
            window.removeEventListener("keydown", keyDownHandler)
            window.removeEventListener("keyup", keyUpHandler)
        }
    }, [])

    useLayoutEffect(() => {
        if (keyPressed)
            return

        // get our center
        const node = rf.getNode(id)
        if (!node)
            return
        const center = {
            x: x + node.width / 2,
            y: y + node.height / 2,
        }

        // find nodes that are eligible to snap to 
        const [closestLeft, closestRight] = rf.getNodes().reduce((closest, node) => {
            // ignore our node
            if (node.id == id)
                return closest

            // get center
            const currentCenter = {
                x: node.position.x + node.width / 2,
                y: node.position.y + node.height / 2,
            }

            // ignore one's outside of vertical snapping distance
            if (Math.abs(currentCenter.y - center.y) > distance)
                return closest

            // ignore ones outside of horizontal lookaround
            if (Math.abs(currentCenter.x - center.x) > horizontalLookaround)
                return closest

            // compare nodes to the left
            if (currentCenter.x < center.x && (!closest[0] || currentCenter.x > closest[0].x))
                return [currentCenter, closest[1]]

            // compare nodes to the right
            if (currentCenter.x > center.x && (!closest[1] || currentCenter.x < closest[1].x))
                return [closest[0], currentCenter]

            return closest
        }, [null, null])

        // find closest
        const closest = closestLeft && closestRight ?
            (Math.abs(closestLeft.y - center.y) < Math.abs(closestRight.y - center.y) ? closestLeft : closestRight) :
            (closestLeft ?? closestRight)

        if (closest) {
            rf.setNodes(produce(draft => {
                const node = draft.find(node => node.id == id)
                node.position.y = closest.y - node.height / 2
            }))
        }

    }, [x, y])
}


/**
 * Opens the node palette.
 *
 * @export
 * @param {import("reactflow").ReactFlowInstance} rf
 * @param {Object} [options]
 * @param {Object} [options.innerProps]
 * @param {string} [options.subtitle]
 */
export function openNodePalette(rf, {
    innerProps = {},
    subtitle,
    ...props
} = {}) {
    openContextModal({
        modal: "NodePalette",
        innerProps: {
            rf,
            ...innerProps,
        },
        title: <Group>
            <Title order={3}>Add a node</Title>
            {subtitle &&
                <Text color="dimmed">{subtitle}</Text>}
        </Group>,
        size: "lg",
        centered: true,
        transitionProps: {
            duration: 200,
        },
        ...props,
    })
}


/**
 * Node & Edge Actions
 */

export function deleteElementsById(rf, { nodeIds = [], edgeIds = [] } = {}) {
    rf.deleteElements({
        nodes: nodeIds.map(id => rf.getNode(id)),
        edges: edgeIds.map(id => rf.getEdge(id)),
    })
}


export function deleteNodeById(rf, nodeId) {
    deleteElementsById(rf, { nodeIds: [nodeId] })
}


export function deleteEdgeById(rf, edgeId) {
    deleteElementsById(rf, { edgeIds: [edgeId] })
}


export function createNode(nodeType, position) {
    // added this offset because that's how far off RF's project function was -- not sure why
    return {
        id: `${nodeType}_${shortUUID.generate()}`,
        type: nodeType,
        data: {
            state: {}
        },
        position,
        focusable: false,
    }
}


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


export function deselectNode(rf, nodeId) {
    rf.setNodes(applyNodeChanges([{
        id: nodeId,
        type: "select",
        selected: false,
    }], rf.getNodes()))
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


export function getNodeType(node) {
    return node && NodeDefinitions[node.type]
}


export function getNodeTypeById(rf, nodeId) {
    return NodeDefinitions[rf.getNode(nodeId)?.type]
}


export function getNodeIntegrationsStatus(nodeType, appIntegrations) {
    return nodeType.requiredIntegrations?.map(intId => ({
        ...Integrations[intId],
        status: appIntegrations[intId] ?? {},
    })) ?? []
}


export function addNodeAtCenter(rf, type) {
    rf.addNodes(createNode(type, getProjectedCenter(rf)))
}


export function addNodesAtCenter(rf, types) {
    const center = getProjectedCenter(rf)

    // create nodes while staggering
    rf.addNodes(
        types.map((type, i) => createNode(type, {
            x: center.x + i * 20,
            y: center.y + i * 20,
        }))
    )
}


export function addNodeAtWindowPoint(rf, type, x, y) {
    rf.addNodes(createNode(type, projectWindowPoint(rf, x, y)))
}


const PROJECTION_ADJUSTMENT = { x: -80, y: -30 }

export function getProjectedCenter(rf) {
    const rfWindow = document.getElementById("node-editor").getBoundingClientRect()
    const center = rf.project({
        x: rfWindow.width / 2,
        y: rfWindow.height / 2,
    })
    center.x += PROJECTION_ADJUSTMENT.x
    center.y += PROJECTION_ADJUSTMENT.y
    return center
}

export function projectWindowPoint(rf, x, y) {
    const rfWindow = document.getElementById("node-editor").getBoundingClientRect()
    const projected = rf.project({
        x: x - rfWindow.left,
        y: y - rfWindow.top,
    })
    projected.x += PROJECTION_ADJUSTMENT.x
    projected.y += PROJECTION_ADJUSTMENT.y
    return projected
}


export function addNeighborNode(rf, {
    originNodeId,
    originHandle,
    type,
    handle,
    direction,
    topOffset = 0,
} = {}) {

    const { position: { x, y }, width, height } = rf.getNode(originNodeId)
    const xOffset = 150

    const newNode = createNode(type, {
        x: direction == HandleType.Input ? x - xOffset - 200 : x + width + xOffset,
        y: y + 2 * (topOffset + 12 - height / 2),
    })

    const newEdge = originHandle && handle && (
        direction == HandleType.Input ?
            createEdge(newNode.id, handle, originNodeId, originHandle) :
            createEdge(originNodeId, originHandle, newNode.id, handle)
    )

    rf.addNodes(newNode)
    newEdge && rf.addEdges(newEdge)

    selectNode(rf, newNode.id)
}


/**
 * Special Utilities
 */

export function serializeGraph(nodes = [], edges = []) {
    return JSON.stringify({
        nodes,
        edges,
    })
}


export function deserializeGraph(str = "{}") {
    const { nodes, edges } = JSON.parse(str)
    return { nodes, edges }
}


export function formatHandleName(handleId) {

    const handleDefId = handleId.split(".")[0]

    if (handleDefId.startsWith("_"))
        return ""

    return handleDefId
        .replace("$", "")
        .trim()
        .match(/[A-Z]?[^A-Z]+/g)
        ?.map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
        .join(" ") ?? ""
}
