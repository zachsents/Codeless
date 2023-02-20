import { useEffect } from "react"
import { useKeyPress, useReactFlow } from "reactflow"
import { Card, Group, Text, Box, ActionIcon, useMantineTheme, ThemeIcon, Badge } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { AnimatePresence, motion } from "framer-motion"
import { TbCopy, TbExclamationMark, TbTrash } from "react-icons/tb"

import { createEdge, createNode, deleteNodeById, deselectNode, getNodeType, selectNode, useHandleAlignment, useNodeData, useNodeDisplayProps, useNodeMinHeight, useNodeSnapping } from "../../modules/graph-util"
import { useAppContext, useFlowContext } from "../../modules/context"
import { useCallback } from "react"
import { Integrations } from "@minus/client-nodes"
import Handle, { HandleDirection } from "./Handle"


export default function Node({ id, type, selected, dragging, xPos, yPos }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()
    const { app } = useAppContext()
    const { latestRun } = useFlowContext()

    const nodeType = getNodeType({ type })
    const [data, setData] = useNodeData(id)                                     // node's internal data
    const displayProps = useNodeDisplayProps(id)                                // props to pass to display override components
    const [stackHeight, addHeightRef] = useNodeMinHeight()                      // making sure card is correct size
    const [handleAlignments, alignHandles, headerRef] = useHandleAlignment()    // handle alignment

    // hover for showing handle labels
    const { hovered, ref: hoverRef } = useHover()

    // alt-dragging for duplication -- TO DO: implement this
    const duplicating = useKeyPress("Alt") && hovered

    // side effect: when deselected, close node
    useEffect(() => {
        !selected && setData({ expanded: false, focused: false })
    }, [selected])

    // side effect: when dragging, deselect
    useEffect(() => {
        dragging && deselectNode(rf, id)
    }, [dragging])

    // callback for adding neighbor node
    const addNeighborNode = useCallback((targetType, targetHandle, sourceHandle) => {

        const { position: { x, y }, width } = rf.getNode(id)

        const newNode = createNode(targetType, {
            x: x + width + 150,
            y: y,
        })
        const newEdge = createEdge(id, sourceHandle, newNode.id, targetHandle)

        rf.addNodes(newNode)
        rf.addEdges(newEdge)
        selectNode(rf, newNode.id)
    }, [rf])

    const commonHandleGroupProps = {
        includeContainer: true,
        queryListHandle: name => data?.listHandles?.[name] ?? 0,
        handleProps: handleId => ({
            showLabel: hovered,
            connected: displayProps.connections[handleId],
            align: handleAlignments[handleId],
            onAddSuggested: (targetType, targetHandle) => addNeighborNode(targetType, targetHandle, handleId),
        }),
    }

    // handle snapping position 
    useNodeSnapping(id, xPos, yPos)

    // integrations
    const integrationsSatisfied = nodeType.requiredIntegrations?.every(intId => Integrations[intId].manager.isAppAuthorized(app)) ?? true

    return (
        <motion.div
            initial={{ outline: "none" }}
            animate={{ outline: `${selected ? 3 : 0}px solid ${theme.colors.yellow[5]}` }}
            transition={{ duration: 0.15 }}
            style={{ borderRadius: theme.radius.md }}
            ref={hoverRef}
        >

            {/* Handles */}
            <Handle.Group
                handles={nodeType.inputs}
                direction={HandleDirection.Input}
                {...commonHandleGroupProps}
                ref={addHeightRef(0)}
            />
            <Handle.Group
                handles={nodeType.outputs}
                direction={HandleDirection.Output}
                {...commonHandleGroupProps}
                ref={addHeightRef(1)}
            />

            {/* Main Content */}
            <Card
                radius="md"
                p="sm"
                shadow="sm"
                mih={stackHeight}
                sx={cardStyle(id, { copyCursor: duplicating, selected })}
            // onDoubleClick={() => setData({ expanded: true, focused: true })}
            >
                {/* Header */}
                <Card.Section withBorder p="xs">
                    <Group position="apart" ref={headerRef}>
                        <Group spacing="xs">
                            {nodeType.color ?
                                <ThemeIcon color={nodeType.color} size="sm" radius="xl">
                                    <nodeType.icon size={10} />
                                </ThemeIcon>
                                :
                                <nodeType.icon size={16} />
                            }
                            <Text
                                maw={120}
                                lh={1.2}
                                size="xs"
                                ff="DM Sans"
                            >
                                {nodeType.renderName?.(displayProps) ?? nodeType.name}
                            </Text>
                        </Group>

                        {nodeType.badge &&
                            <Badge size="xs" color={nodeType.color ?? "gray"}>
                                {nodeType.badge}
                            </Badge>}
                    </Group>
                </Card.Section>

                {/* Body */}
                {nodeType.renderNode &&
                    <Box mt="sm">
                        <nodeType.renderNode
                            {...displayProps}
                            alignHandles={alignHandles}
                            integrationsSatisfied={integrationsSatisfied}
                        />
                    </Box>
                }
            </Card>

            {/* Error Icon */}
            <AnimatePresence>
                {(latestRun?.errors[id]?.length > 0 || !integrationsSatisfied) &&
                    <ErrorIcon />}
            </AnimatePresence>

            {/* Controls */}
            <AnimatePresence>
                {selected && !dragging &&
                    <Box sx={controlsStyle}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.5, delay: 0.1 }}
                        >
                            <Card shadow="sm" p={5} radius="md" sx={{ pointerEvents: "all" }}>
                                <Group spacing="xs" noWrap>
                                    <ActionIcon disabled size="md" radius="sm">
                                        <TbCopy size={16} />
                                    </ActionIcon>
                                    {nodeType.deletable !== false &&
                                        <ActionIcon size="md" radius="sm" color="red" onClick={() => deleteNodeById(rf, id)}>
                                            <TbTrash size={16} />
                                        </ActionIcon>}
                                </Group>
                            </Card>
                        </motion.div>
                    </Box>}
            </AnimatePresence>
        </motion.div>
    )
}



function ErrorIcon() {
    return (
        <Box
            sx={{
                position: "absolute",
                top: -8,
                right: -8,
                zIndex: 11,
            }}
        >
            <motion.div initial={{ scale: 0, rotate: -135 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -135 }} transition={{ duration: 0.1 }}>
                {/* <Tooltip withArrow label={<Text size="xs">There were errors on the last run</Text>}> */}
                    <ActionIcon
                        size="xs"
                        radius="sm"
                        variant="filled"
                        color="red.7"
                    >
                        <TbExclamationMark size={12} />
                    </ActionIcon>
                {/* </Tooltip> */}
            </motion.div>
        </Box>
    )
}


const cardStyle = (id, { copyCursor, /* selected */ }) => ({
    overflow: "visible",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: copyCursor ? "copy" : undefined,
})

const controlsStyle = theme => ({
    position: "absolute",
    bottom: "100%",
    left: "50%",
    marginBottom: theme.spacing.xs,
    transform: "translateX(-50%)",
    pointerEvents: "none",
})
