import { ActionIcon, Flex } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { AnimatePresence, motion } from "framer-motion"
import { TbX } from "react-icons/tb"
import { getBezierPath, useReactFlow } from "reactflow"
import { deleteEdgeById } from "../../modules/graph-util"
import styles from "./DataEdge.module.css"


const InteractionPadding = 20
const ForeignObjectSize = 30


export default function DataEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
    data,
}) {

    const rf = useReactFlow()

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    const handleDelete = event => {
        event.stopPropagation()
        deleteEdgeById(rf, id)
    }

    const { hovered, ref: hoverRef } = useHover()

    const draw = {
        hidden: {
            pathLength: 0,
        },
        visible: {
            pathLength: 1,
            transition: { type: "spring", duration: 1, bounce: 0 },
        },
    }


    return (
        <g ref={hoverRef}>
            <motion.path
                id={id}
                style={style}
                className={`react-flow__edge-path ${styles.edge} ${selected ? styles.selected : ""}`}
                d={edgePath}
                markerEnd={markerEnd}

                variants={draw}
                initial={data?.animate ? "hidden" : "visible"}
                animate="visible"
            />
            <path
                style={{
                    strokeWidth: InteractionPadding,
                    stroke: "transparent",
                    fill: "none",
                }}
                className="react-flow__edge-interaction"
                d={edgePath}
            />
            <foreignObject
                width={ForeignObjectSize}
                height={ForeignObjectSize}
                x={labelX - ForeignObjectSize / 2}
                y={labelY - ForeignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <Flex w="100%" h="100%" justify="center" align="center">
                    <AnimatePresence>
                        {(hovered || selected) &&
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", duration: 0.2 }}
                            >
                                <ActionIcon size="md" radius="xl" color="red" variant="filled" onClick={handleDelete}>
                                    <TbX />
                                </ActionIcon>
                            </motion.div>}
                    </AnimatePresence>
                </Flex>
            </foreignObject>
        </g>
    )
}