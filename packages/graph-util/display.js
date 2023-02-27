import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useUpdateNodeInternals, useViewport, useStore, useReactFlow } from "reactflow"
import { produce } from "immer"
import { useInterval } from "@mantine/hooks"


export function useSmoothlyUpdateNode(id, deps, {
    interval = 35
} = {}) {
    const updateNodeInterals = useUpdateNodeInternals()

    const nodeUpdateInterval = useInterval(() => {
        updateNodeInterals(id)
    }, interval)

    deps && useEffect(() => {
        nodeUpdateInterval.start()
    }, deps)

    return {
        start: nodeUpdateInterval.start,
        stop: () => {
            nodeUpdateInterval.stop()
            updateNodeInterals(id)
        }
    }
}


export function useNodeMinHeight() {

    const stackRefs = useRef([])
    const addRef = index => el => stackRefs.current[index] = (el?.offsetHeight ?? 0)

    return [
        Math.max(...stackRefs.current),
        addRef
    ]
}


export function useNodeScreenPosition(id) {

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


export function useNodeDragging(id) {
    const dragging = useStore(s => Object.fromEntries(s.nodeInternals)[id]?.dragging)
    return dragging
}


export function useNodeSnapping(id, x, y, {
    reactFlow,
    distance = 10,
    horizontalLookaround = 500,
    preventSnappingKey = "Shift"
} = {}) {
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