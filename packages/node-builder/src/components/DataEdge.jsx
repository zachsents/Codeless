import { ActionIcon, useMantineTheme } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import React from 'react'
import { TbX } from 'react-icons/tb'
import { getBezierPath } from 'reactflow'
import { useDeleteEdge } from '../util'
import { motion, AnimatePresence } from "framer-motion"

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
}) {

    const theme = useMantineTheme()

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    const deleteEdge = useDeleteEdge(id)

    const onEdgeClick = event => {
        event.stopPropagation()
        deleteEdge()
    }

    const { hovered, ref: hoverRef } = useHover()

    return (
        <g ref={hoverRef}>
            <path
                id={id}
                style={{
                    strokeWidth: 2,
                    stroke: selected ? theme.colors.yellow[5] : theme.colors.gray[5],
                    ...style,
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
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
                <AnimatePresence>
                    {hovered &&
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", duration: 0.2 }}
                        >
                            <ActionIcon size="sm" radius="md" color="red" variant="filled" onClick={onEdgeClick}>
                                <TbX />
                            </ActionIcon>
                        </motion.div>}
                </AnimatePresence>
            </foreignObject>
        </g>
    )
}