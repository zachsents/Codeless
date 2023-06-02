import { Badge, Box, Card, Group, Stack, useMantineTheme } from "@mantine/core"
import { useHover, useSetState } from "@mantine/hooks"
import { motion } from "framer-motion"
import { useEffect } from "react"

import { useAppContext } from "@web/modules/context"
import {
    selectNode,
    useNodeConnections,
    useSmoothlyUpdateNode
} from "@web/modules/graph-util"

import { NodeDefinitions } from "@minus/client-nodes"
import { NodeProvider, useIntegrationAccounts, useNodeContext, useStoreProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { useAppId, useFlowId } from "@web/modules/hooks"
import { useReactFlow } from "reactflow"
import ConfigPopover from "./ConfigPopover"
import ErrorIcon from "./ErrorIcon"
import NodeInternal from "./NodeInternal"
import HandleStack from "./handle/HandleStack"
import InputHandle from "./handle/InputHandle"
import ListHandle from "./handle/ListHandle"
import OutputHandle from "./handle/OutputHandle"


export default function Node({ id, type: typeDefId, selected }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const typeDefinition = NodeDefinitions[typeDefId]

    // #region - Integrations (satisfaction)
    const { app } = useAppContext()
    const { missingSelections } = useIntegrationAccounts(id, app)
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
        integrationsSatisfied: !missingSelections,
    }
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

    // disabling this for now because it happens before the popover
    // animation finishes
    // const clickOutsideRef = useClickOutside(() => setContextMenu(null), ["click"])
    const handleContextMenu = event => {
        event.preventDefault()
        setContextMenu(id)
        selectNode(rf, id)
    }
    // #endregion

    return (
        <NodeProvider value={{ id, displayProps }}>
            <Box
                onContextMenu={handleContextMenu}
            // ref={clickOutsideRef}
            >
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
                    <Stack spacing="xxxs" px="xs" py="xxxs">

                        {/* Tags */}
                        {typeDefinition.tags[0] && typeDefinition.showMainTag &&
                            <Group position="apart">
                                <Badge size="sm" radius="sm" color={typeDefinition.color} >
                                    {typeDefinition.tags[0]}
                                </Badge>

                                <ErrorIcon />
                            </Group>}

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
                                        px="md" py="xs"
                                        shadow={selected ? "sm" : "xs"}
                                        className="ofv border-1 border-solid border-dark-400"
                                    // sx={{ borderRadius: "1.25rem" }}
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
                    </Stack>

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