import { Badge, Box, Card, Center, Group, Stack, useMantineTheme } from "@mantine/core"
import { useHover, useSetState } from "@mantine/hooks"
import { motion } from "framer-motion"
import { useEffect } from "react"

import {
    selectNode,
    useNodeDisplayProps,
    useSmoothlyUpdateNode
} from "@web/modules/graph-util"

import { NodeDefinitions } from "@minus/client-nodes"
import { NodeProvider, useNodeContext, useStoreProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { TbLock } from "react-icons/tb"
import { useReactFlow } from "reactflow"
import ErrorIcon from "./ErrorIcon"
import NodeInternal from "./NodeInternal"
import SelectedControls from "./SelectedControls"
import InputHandle from "./handle/InputHandle"
import ListHandle from "./handle/ListHandle"
import OutputHandle from "./handle/OutputHandle"


export default function Node({ id, type: typeDefId, selected }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const typeDefinition = NodeDefinitions[typeDefId]

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

    const displayProps = useNodeDisplayProps(id)

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
        <NodeProvider id={id} displayProps={displayProps}>
            <Box
                onContextMenu={handleContextMenu}
            // ref={clickOutsideRef}
            >
                <SelectedControls>
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
                                <Group position="apart" spacing="xs">
                                    <Group spacing="xxxs">
                                        <Badge size="sm" radius="sm" color={typeDefinition.color} >
                                            {typeDefinition.tags[0]}
                                        </Badge>

                                        {typeDefinition.trigger &&
                                            <Center ><TbLock color={theme.fn.primaryColor()} size={theme.fontSizes.sm} /></Center>}
                                    </Group>

                                    <ErrorIcon />
                                </Group>}

                            <Group spacing={0}>

                                {/* Input Handles */}
                                {!typeDefinition.renderCard &&
                                    <Stack>
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
                                    </Stack>}

                                {typeDefinition.renderCard ?
                                    <Card
                                        px="md" py="xs"
                                        shadow={selected ? "sm" : "xs"}
                                        // shadow={selected ? "sm" : false}
                                        // className="ofv border-1 border-solid border-dark-300"
                                        className="ofv base-border"
                                    >
                                        <Stack>
                                            <NodeInternal displayProps={displayProps} />

                                            <Group position="apart" noWrap spacing="lg" className="-mx-6">
                                                <Stack spacing="xxxs">
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
                                                </Stack>

                                                <Stack spacing="xxxs">
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
                                                </Stack>
                                            </Group>
                                        </Stack>
                                    </Card>
                                    :
                                    <Box>
                                        <NodeInternal displayProps={displayProps} />
                                    </Box>}

                                {/* Output Handles */}
                                {!typeDefinition.renderCard &&
                                    <Stack>
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
                                    </Stack>}
                            </Group>
                        </Stack>

                    </motion.div>
                </SelectedControls>
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