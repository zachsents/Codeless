import { useState, useCallback } from 'react'
import { useOnSelectionChange, useReactFlow } from 'reactflow'
import { ActionIcon, Box, Card, Group, Text, Stack, Tooltip, Title, ThemeIcon, Badge, ScrollArea, useMantineTheme, Accordion, Flex } from '@mantine/core'
import { motion, AnimatePresence } from "framer-motion"
import {  TbAlertTriangle, TbTrash, TbX } from "react-icons/tb"

import { removeEdges, removeNodes, useNodeDisplayProps, useNodeDragging, useNodeSelection, useNodeType } from '../../modules/graph-util'


export default function ActiveDetails() {

    const [selectedNodes, setSelectedNodes] = useState([])
    const [selectedEdges, setSelectedEdges] = useState([])

    // watch selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        setSelectedNodes(nodes)
        setSelectedEdges(edges)
    })
    useOnSelectionChange({ onChange: onSelectionChange })

    const emptySelection = selectedNodes.length == 0 && selectedEdges.length == 0
    const singleNodeSelected = selectedNodes.length == 1 && selectedEdges.length == 0

    const [dragging] = useNodeDragging(selectedNodes[0]?.id)
    

    return (
        <AnimatePresence>
            {!emptySelection &&
                (singleNodeSelected ?
                    (dragging ?
                        <></> :
                        <NodeConfig node={selectedNodes[0]} key={selectedNodes[0].id} />) :
                    <Box sx={underScreenContainerStyle}>
                        <DefaultToolbar selectedEdges={selectedEdges} selectedNodes={selectedNodes} />
                    </Box>)}
        </AnimatePresence>
    )
}

function NodeConfig({ node }) {

    const rf = useReactFlow()
    const theme = useMantineTheme()

    const nodeType = useNodeType({ type: node.type })
    const hasConfiguration = !!nodeType.configuration

    const displayProps = useNodeDisplayProps(node.id)
    const [, , deselect] = useNodeSelection(node.id, { reactFlow: rf })

    const [accordionValue, setAccordionValue] = useState(hasConfiguration ? "options" : null)

    const numUnconnectedInputs = Object.values(displayProps.inputConnections).reduce((sum, cur) => sum + !cur, 0)

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", duration: 0.5, spring: 0.5 }}
            style={configContainerStyle(theme)}
        >
            <ScrollArea w="100%" h="100%">
                <Flex p="lg" direction="column" align="flex-end" justify="flex-start">
                    <Card
                        radius="md" shadow="sm" w={300} mah="100%"
                        sx={{ pointerEvents: "all", overflow: "visible" }}
                    >
                        <Stack spacing="xl">

                            {/* Header */}
                            <Group spacing="xs" position="apart" noWrap align="start">
                                <Stack spacing="xs">
                                    <Group noWrap>
                                        {nodeType.color ?
                                            <ThemeIcon color={nodeType.color} size="lg" radius="xl">
                                                <nodeType.icon size={18} />
                                            </ThemeIcon>
                                            :
                                            <nodeType.icon size={22} />
                                        }
                                        <Title order={3}>{nodeType.name}</Title>
                                    </Group>
                                    <Group>
                                        {nodeType.badge &&
                                            <Badge color={nodeType.color ?? "gray"}>
                                                {nodeType.badge}
                                            </Badge>}
                                        {node.id == "trigger" && <Badge>Trigger</Badge>}
                                    </Group>
                                </Stack>

                                <ActionIcon radius="md" onClick={deselect}>
                                    <TbX />
                                </ActionIcon>
                            </Group>

                            {numUnconnectedInputs > 0 &&
                                <Group noWrap p="xs" sx={theme => ({ backgroundColor: theme.colors.gray[0], borderRadius: theme.radius.md })}>
                                    <ThemeIcon color="yellow">
                                        <TbAlertTriangle />
                                    </ThemeIcon>
                                    <Text size="sm" color="dimmed">
                                        This node has {numUnconnectedInputs} input{numUnconnectedInputs == 1 ? " that isn't " : "s that aren't "}
                                        connected.
                                    </Text>
                                </Group>}

                            {/* Body */}
                            <Accordion
                                variant="separated"
                                value={accordionValue} onChange={setAccordionValue}
                                styles={theme => ({
                                    item: { border: "none" },
                                    content: { padding: theme.spacing.xs },
                                    label: { overflow: "visible" },
                                })}
                            >
                                {hasConfiguration &&
                                    <Accordion.Item value="options">
                                        <Accordion.Control>
                                            <AccordionTitle active={accordionValue == "options"}>Options</AccordionTitle>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            {rf.getNode(node.id) &&
                                                <nodeType.configuration {...displayProps} />}
                                        </Accordion.Panel>
                                    </Accordion.Item>}

                                <Accordion.Item value="testing">
                                    <Accordion.Control>
                                        <AccordionTitle active={accordionValue == "testing"}>Testing</AccordionTitle>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Text color="dimmed" size="sm" align="center">No test data to show.</Text>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="errors">
                                    <Accordion.Control>
                                        <AccordionTitle active={accordionValue == "errors"}>Problems</AccordionTitle>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Accordion>
                        </Stack>
                    </Card>
                </Flex>
            </ScrollArea>
        </motion.div>
    )
}

const configContainerStyle = theme => ({
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 100,
    // padding: theme.spacing.lg,
    width: 500,
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "flex-end",
})

function AccordionTitle({ children, active }) {
    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: active ? -10 : 0 }}
        >
            <Title order={5}>{children}</Title>
        </motion.div>
    )
}


function DefaultToolbar({ selectedNodes, selectedEdges }) {
    return (
        <motion.div initial={{ y: 40 }} animate={{ y: "calc(-100% - 40px)" }} exit={{ y: 40 }} key="multi">
            <ToolbarCard>
                <Group spacing={5}>
                    <DeleteButton nodes={selectedNodes} edges={selectedEdges} disabled={selectedNodes.some(node => node.deletable === false)} />
                </Group>
            </ToolbarCard>
        </motion.div>
    )
}


function ToolbarCard({ children }) {
    return (
        <Card
            px="xl"
            py="xs"
            shadow="md"
            withBorder={false}
            sx={cardStyle}
        >
            <Group spacing="lg">
                {children}
            </Group>
        </Card>
    )
}


function DeleteButton({ nodes, edges, label, ...props }) {

    const reactFlow = useReactFlow()

    const handleClick = () => {
        edges.length && removeEdges(edges.map(e => e.id), reactFlow)
        nodes.length && removeNodes(nodes.map(n => n.id), reactFlow)
    }

    return (
        <Tooltip label={label ? `Remove ${label}` : "Remove"}>
            <ActionIcon color="red" size="lg" radius="md" onClick={handleClick} {...props}>
                <TbTrash fontSize={22} />
            </ActionIcon>
        </Tooltip>
    )
}


const cardStyle = theme => ({
    borderRadius: "100vw",
    overflow: "visible",
})

const underScreenContainerStyle = theme => ({
    position: "absolute",
    // bottom: 40,
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
})