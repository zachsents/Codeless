import { useEffect } from "react"
import { useReactFlow } from "reactflow"
import { Card, Group, Text, Box, ActionIcon, useMantineTheme, ThemeIcon, Badge } from "@mantine/core"
import { useHover, useSetState } from "@mantine/hooks"
import { AnimatePresence, motion } from "framer-motion"
import { TbCopy, TbExclamationMark, TbTrash } from "react-icons/tb"

import { useNodeSuggestions } from "@minus/client-sdk"
import {
    deleteNodeById, deselectNode, getNodeIntegrationsStatus, getNodeType, NodeProvider,
    useHandleAlignment, useNodeConnections, useNodeMinHeight, useNodeSnapping
} from "@minus/graph-util"
import { useAppContext, useFlowContext } from "../../modules/context"
import Handle, { HandleDirection } from "./Handle"


export default function Node({ id, type, selected, dragging, xPos, yPos }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const { app, integrations: appIntegrations } = useAppContext()
    const { flow, latestRun } = useFlowContext()

    const nodeType = getNodeType({ type })
    const [inputConnections, outputConnections] = useNodeConnections(id, { nodeType })
    const [stackHeight, addHeightRef] = useNodeMinHeight()
    const [handleAlignments, alignHandles, headerRef] = useHandleAlignment()

    // hover for showing handle labels
    const { hovered, ref: hoverRef } = useHover()
    const [handlesHovered, setHandlesHovered] = useSetState({})

    // alt-dragging for duplication -- TO DO: implement this
    // const duplicating = useKeyPress("Alt") && hovered

    // side effect: when dragging, deselect
    useEffect(() => {
        dragging && deselectNode(rf, id)
    }, [dragging])

    // suggestions
    const { suggestions } = useNodeSuggestions(type)

    // handle snapping position 
    useNodeSnapping(id, xPos, yPos)

    // integrations
    const nodeIntegrations = getNodeIntegrationsStatus(nodeType, appIntegrations)
    const integrationsSatisfied = nodeIntegrations.every(int => int.status.data)
    const integrationsLoading = nodeIntegrations.some(int => int.status.isLoading)

    // props for all handle groups
    const commonHandleGroupProps = {
        includeContainer: true,
        handleProps: handleId => ({
            nodeHovered: hovered && !Object.values(handlesHovered).some(x => x),
            nodeId: id,
            nodeName: nodeType.name,
            connected: inputConnections[handleId] ?? outputConnections[handleId],
            align: handleAlignments[handleId],
            suggestions: suggestions?.[handleId],
            onHover: handleHovered => setHandlesHovered({ [handleId]: handleHovered })
        }),
    }

    
    return (
        <NodeProvider
            id={id}
            type={nodeType}
            appId={app?.id}
            flowId={flow?.id}
            alignHandles={alignHandles}
            integrationsSatisfied={integrationsSatisfied}
        >
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
                    sx={cardStyle(id, { copyCursor: false, selected })}
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
                                >
                                    {nodeType.renderName ? <nodeType.renderName /> : nodeType.name}
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
                            <nodeType.renderNode />
                        </Box>
                    }
                </Card>

                {/* Error Icon */}
                <AnimatePresence>
                    {(latestRun?.errors[id]?.length > 0 || (!integrationsSatisfied && !integrationsLoading)) &&
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
        </NodeProvider>
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
