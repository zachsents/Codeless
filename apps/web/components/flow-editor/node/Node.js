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


export default function Node({ id, type: typeDefId, selected, dragging }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const typeDefinition = NodeDefinitions[typeDefId]
    const [mainColor, bgColor] = useColors(id, ["primary", 0])

    // integrations
    const { integrations: appIntegrations } = useAppContext()
    const nodeIntegrations = getNodeIntegrationsStatus(typeDefinition, appIntegrations)
    const integrationsSatisfied = nodeIntegrations.every(int => int.status.data)

    // hover for showing handle labels
    const { hovered, ref: hoverRef } = useHover()
    const [handlesHovered, setHandlesHovered] = useSetState({})
    const showHandles = hovered && !Object.values(handlesHovered).some(x => x)

    // props for Handles
    const handleProps = handleId => ({
        id: handleId,
        nodeHovered: showHandles,
        onHover: handleHovered => setHandlesHovered({ [handleId]: handleHovered })
    })

    // props to pass to display override components
    const [inputConnections, outputConnections] = useNodeConnections(id)
    const displayProps = {
        appId: useAppId(),
        flowId: useFlowId(),
        inputConnections,
        outputConnections,
        connections: { ...inputConnections, ...outputConnections },
        integrationsSatisfied,
    }

    // side effect: when dragging, deselect
    useEffect(() => {
        dragging && deselectNode(rf, id)
    }, [dragging])

    // periodically update node internals
    const stopUpdating = useSmoothlyUpdateNode(id, [], {
        interval: 1000,
    })
    useEffect(() => stopUpdating, [])

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
                            <InputHandle {...handleProps(input.id)} key={input.id} />
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
                            <Handle {...handleProps(output.id)} key={output.id} />
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