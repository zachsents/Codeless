import { getBezierPath, useReactFlow } from 'reactflow'
import { ActionIcon, Flex, useMantineTheme } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { motion, AnimatePresence } from "framer-motion"
import { TbX } from 'react-icons/tb'

import { deleteEdgeById } from '../../modules/graph-util'


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
    const rf = useReactFlow()

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    const onEdgeClick = event => {
        event.stopPropagation()
        deleteEdgeById(rf, id)
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
                <Flex w="100%" h="100%" justify="center" align="center">
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
                </Flex>
            </foreignObject>
        </g>
    )
}