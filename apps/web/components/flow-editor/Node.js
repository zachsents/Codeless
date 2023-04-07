import { ActionIcon, Box, Card, Group, Popover, Stack, Text, useMantineTheme } from "@mantine/core"
import { useHover, useSetState } from "@mantine/hooks"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { TbCopy, TbExclamationMark, TbTrash } from "react-icons/tb"
import { useReactFlow } from "reactflow"

import { useNodeSuggestions } from "@minus/client-sdk"
import { useAppContext, useFlowContext } from "../../modules/context"
import {
    deleteNodeById, deselectNode, getNodeIntegrationsStatus, getNodeType,
    useHandleAlignment, useNodeData, useNodeDisplayProps, useNodeMinHeight, useSmoothlyUpdateNode
} from "@web/modules/graph-util"
import Handle, { HandleDirection } from "./Handle"

import styles from "./Node.module.css"


export default function Node({ id, type, selected, dragging }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()
    const { integrations: appIntegrations } = useAppContext()
    const { latestRun } = useFlowContext()

    const typeDefinition = getNodeType({ type })
    const mainColor = theme.colors[typeDefinition.color][theme.primaryShade.light]
    const dimmedColor = theme.colors[typeDefinition.color][3]

    // integrations
    const nodeIntegrations = getNodeIntegrationsStatus(typeDefinition, appIntegrations)
    const integrationsSatisfied = nodeIntegrations.every(int => int.status.data)
    const integrationsLoading = nodeIntegrations.some(int => int.status.isLoading)

    const [data] = useNodeData(id)                                              // node's internal data
    const [stackHeight, addHeightRef] = useNodeMinHeight()                      // making sure card is correct size
    const [handleAlignments, alignHandles] = useHandleAlignment()    // handle alignment

    // props to pass to display override components
    const displayProps = {
        ...useNodeDisplayProps(id),
        integrationsSatisfied,
        alignHandles,
        typeDefinition,
    }

    // hover for showing handle labels
    const { hovered, ref: hoverRef } = useHover()
    const [handlesHovered, setHandlesHovered] = useSetState({})

    // side effect: when dragging, deselect
    useEffect(() => {
        dragging && deselectNode(rf, id)
    }, [dragging])

    // suggestions
    const { suggestions } = useNodeSuggestions(type)

    // props for all handle groups
    const commonHandleGroupProps = {
        includeContainer: true,
        queryListHandle: name => data?.listHandles?.[name] ?? 0,
        handleProps: handleId => ({
            nodeHovered: hovered && !Object.values(handlesHovered).some(x => x),
            nodeId: id,
            nodeName: typeDefinition.name,
            connected: displayProps.connections[handleId],
            align: handleAlignments[handleId],
            suggestions: suggestions?.[handleId],
            onHover: handleHovered => setHandlesHovered({ [handleId]: handleHovered })
        }),
    }

    // handle snapping position 
    // useNodeSnapping(id, xPos, yPos)

    // periodically update node internals
    const stopUpdating = useSmoothlyUpdateNode(id, [], {
        interval: 1000,
    })
    useEffect(() => stopUpdating, [])

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
                handles={typeDefinition.inputs}
                direction={HandleDirection.Input}
                {...commonHandleGroupProps}
                ref={addHeightRef(0)}
            />
            <Handle.Group
                handles={typeDefinition.outputs}
                direction={HandleDirection.Output}
                {...commonHandleGroupProps}
                ref={addHeightRef(1)}
            />

            <Popover position="bottom" opened={selected && !dragging} styles={{
                dropdown: {
                    border: "none",
                }
            }}>
                <Popover.Target>

                    {/* Main Content */}
                    <Card
                        px="lg"
                        py="sm"
                        mih={stackHeight}
                        className={styles.card}
                        bg={`${typeDefinition.color}.0`}
                        sx={{
                            border: `1px solid ${mainColor}`,
                        }}
                    >
                        <Stack>
                            {typeDefinition.renderName &&
                                <Group position="apart">
                                    <Group>
                                        <typeDefinition.icon color={mainColor} size={24} />
                                        {/* <ThemeIcon color={typeDefinition.color} size="sm" radius="xl">
                                            <typeDefinition.icon size={10} />
                                        </ThemeIcon> */}
                                        <Text size="sm" weight={600} color={typeDefinition.color} transform="uppercase" ff="Rubik">
                                            <typeDefinition.renderName {...displayProps} />
                                        </Text>
                                    </Group>

                                    {typeDefinition.tags[0] && typeDefinition.showMainTag &&
                                        <Text size="sm" weight={500} color={dimmedColor} transform="uppercase" ff="Rubik">
                                            {typeDefinition.tags[0]}
                                        </Text>}
                                </Group>}

                            {typeDefinition.renderTextContent &&
                                <Text>
                                    <typeDefinition.renderTextContent {...displayProps} />
                                </Text>}

                            {typeDefinition.renderContent &&
                                <typeDefinition.renderContent {...displayProps} />}
                        </Stack>
                    </Card>
                </Popover.Target>

                <Popover.Dropdown p={0}>

                    {/* Controls */}
                    <Card shadow="sm" p={5}>
                        <Group spacing="xs" noWrap>
                            <ActionIcon disabled size="md" radius="sm">
                                <TbCopy size={16} />
                            </ActionIcon>
                            {typeDefinition.deletable &&
                                <ActionIcon size="md" radius="sm" color="red" onClick={() => deleteNodeById(rf, id)}>
                                    <TbTrash size={16} />
                                </ActionIcon>}
                        </Group>
                    </Card>
                </Popover.Dropdown>
            </Popover>

            {/* Error Icon */}
            <AnimatePresence>
                {(latestRun?.errors[id]?.length > 0 || (!integrationsSatisfied && !integrationsLoading)) &&
                    <ErrorIcon />}
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
