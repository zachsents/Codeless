import { Box, Card, Group, useMantineTheme } from "@mantine/core"
import { useHover, useSetState } from "@mantine/hooks"
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
import { NodeProvider, useColors, useNodeContext, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { useAppId, useFlowId } from "@web/modules/hooks"
import ConfigPopover from "./ConfigPopover"
import ErrorIcon from "./ErrorIcon"
import NodeInternal from "./NodeInternal"
import Handle from "./handle/Handle"
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

    return (
        <NodeProvider value={{ id, displayProps }}>
            <motion.div
                initial={{ outline: "none" }}
                animate={{ outline: `${selected ? 3 : 0}px solid ${theme.colors.yellow[5]}` }}
                transition={{ duration: 0.15 }}
                style={{ borderRadius: theme.radius.md }}
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
                                className="ofv"
                                bg={bgColor}
                                sx={{
                                    border: `1px solid ${mainColor}`,
                                }}
                            >
                                <NodeInternal displayProps={displayProps} />
                            </Card>
                            :
                            <Box>
                                <NodeInternal displayProps={displayProps} />
                            </Box>
                        }
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