import { Box, Card, Flex, Group, Popover, useMantineTheme } from "@mantine/core"
import { useClickOutside, useHover, useSetState } from "@mantine/hooks"
import { motion } from "framer-motion"
import { useEffect } from "react"
import { useReactFlow } from "reactflow"

import { useAppContext } from "@web/modules/context"
import {
    deselectNode, getNodeIntegrationsStatus,
    useNodeConnections,
    useSmoothlyUpdateNode
} from "@web/modules/graph-util"

import { NodeDefinitions } from "@minus/client-nodes"
import { NodeProvider, useColors, useNodeContext, useStoreProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { useAppId, useFlowId } from "@web/modules/hooks"
import ConfigPopover from "./ConfigPopover"
import ErrorIcon from "./ErrorIcon"
import styles from "./Node.module.css"
import NodeInternal from "./NodeInternal"
import HandleStack from "./handle/HandleStack"
import InputHandle from "./handle/InputHandle"
import ListHandle from "./handle/ListHandle"
import OutputHandle from "./handle/OutputHandle"


export default function Node({ id, type: typeDefId, selected, dragging }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const typeDefinition = NodeDefinitions[typeDefId]
    const [mainColor, bgColor] = useColors(id, ["primary", 0])

    // #region - Integrations (satisfaction, loading, etc.)
    const { integrations: appIntegrations } = useAppContext()
    const nodeIntegrations = getNodeIntegrationsStatus(typeDefinition, appIntegrations)
    const integrationsSatisfied = nodeIntegrations.every(int => int.status.data)
    // #endregion

    // #region - Hover states for showing handle labels 
    const { hovered, ref: hoverRef } = useHover()
    const [handlesHovered, setHandlesHovered] = useSetState({})
    const showHandles = hovered && !Object.values(handlesHovered).some(x => x)
    // #endregion

    // #region - Handle props
    const handleProps = handleId => ({
        id: handleId,
        nodeHovered: showHandles,
        onHover: (uniqueId, handleHovered) => setHandlesHovered({ [uniqueId]: handleHovered })
    })
    // #endregion

    // #region - Render override components props
    const [inputConnections, outputConnections] = useNodeConnections(id)
    const displayProps = {
        appId: useAppId(),
        flowId: useFlowId(),
        inputConnections,
        outputConnections,
        connections: { ...inputConnections, ...outputConnections },
        integrationsSatisfied,
    }
    // #endregion

    // #region - Side Effect: when dragging, deselect
    useEffect(() => {
        dragging && deselectNode(rf, id)
    }, [dragging])
    // #endregion

    // #region - Periodically update node internals
    const stopUpdating = useSmoothlyUpdateNode(id, [], {
        interval: 1000,
    })
    useEffect(() => stopUpdating, [])
    // #endregion

    // #region - Node animations
    const wrapperAnimVariants = {
        initial: {
            outline: "none",
        },
        idle: {
            outline: `0px solid ${theme.colors.yellow[5]}`,
        },
        selected: {
            outline: `3px solid ${theme.colors.yellow[5]}`,
        },
        hovered: {
            outline: `3px solid ${theme.colors.yellow[2]}`,
        },
    }
    // #endregion

    // #region - Node context menu
    const [, setContextMenu] = useStoreProperty("contextMenu")
    const clickOutsideRef = useClickOutside(() => setContextMenu(null), ["click"])
    const handleContextMenu = event => {
        event.preventDefault()
        setContextMenu(id)
    }
    // #endregion

    return (
        <NodeProvider value={{ id, displayProps }}>
            <Box onContextMenu={handleContextMenu} ref={clickOutsideRef}>
                <motion.div
                    variants={wrapperAnimVariants}
                    initial="initial"
                    animate={selected ? "selected" : hovered ? "hovered" : "idle"}
                    transition={{ duration: 0.1 }}
                    style={{
                        borderRadius: theme.radius.md,
                        cursor: "pointer",
                    }}
                    ref={hoverRef}
                >
                    <Group spacing={0} align="stretch">

                        {/* Input Handles */}
                        <HandleStack>
                            {typeDefinition.inputs.map(input =>
                                input.listMode ?
                                    <ListHandle
                                        {...handleProps(input.id)}
                                        component={InputHandle}
                                        key={input.id}
                                    /> :
                                    <InputHandle
                                        {...handleProps(input.id)}
                                        key={input.id}
                                    />
                            )}
                        </HandleStack>

                        <ConfigPopover>
                            {typeDefinition.renderCard ?
                                <Card
                                    px="lg" py="sm"
                                    bg={bgColor}
                                    shadow={selected ? "md" : "xs"}
                                    className={`ofv ${styles.card}`}
                                    sx={{ "--main-color": mainColor }}
                                >
                                    <NodeInternal displayProps={displayProps} />
                                </Card>
                                :
                                <Box>
                                    <NodeInternal displayProps={displayProps} />
                                </Box>}
                        </ConfigPopover>

                        {/* Output Handles */}
                        <HandleStack>
                            {typeDefinition.outputs.map(output =>
                                output.listMode ?
                                    <ListHandle
                                        {...handleProps(output.id)}
                                        component={OutputHandle}
                                        key={output.id}
                                    /> :
                                    <OutputHandle
                                        {...handleProps(output.id)}
                                        key={output.id}
                                    />
                            )}
                        </HandleStack>
                    </Group>

                    <ErrorIcon />
                </motion.div>
            </Box>

            <Presence />
        </NodeProvider>
    )
}


function Presence() {
    const typeDefinition = useTypeDefinition()
    const { displayProps } = useNodeContext()
    typeDefinition.useNodePresent?.(displayProps)
    return <></>
}