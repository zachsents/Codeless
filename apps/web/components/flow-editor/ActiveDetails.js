import { useState, useCallback } from 'react'
import { useOnSelectionChange, useReactFlow } from 'reactflow'
import { ActionIcon, Box, Card, Group, Text, Stack, Tooltip, Title, ThemeIcon, Badge, ScrollArea, useMantineTheme, Accordion, Flex, Table } from '@mantine/core'
import { motion, AnimatePresence } from "framer-motion"
import { TbAlertTriangle, TbCheck, TbExclamationMark, TbTrash, TbX } from "react-icons/tb"

import { deselectNode, getNodeType, useNodeDisplayProps, useNodeDragging } from '../../modules/graph-util'
import { useFlowContext } from '../../modules/context'
import { Check } from 'tabler-icons-react'


export default function ActiveDetails() {

    const [selectedNodes, setSelectedNodes] = useState([])
    const [selectedEdges, setSelectedEdges] = useState([])

    // watch selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        setSelectedNodes(nodes)
        setSelectedEdges(edges)
    }, [])
    useOnSelectionChange({ onChange: onSelectionChange })

    const emptySelection = selectedNodes.length == 0 && selectedEdges.length == 0
    const singleNodeSelected = selectedNodes.length == 1 && selectedEdges.length == 0

    const dragging = useNodeDragging(selectedNodes[0]?.id)


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

    const { latestRun } = useFlowContext()
    const displayProps = useNodeDisplayProps(node.id)
    const nodeType = getNodeType(node)
    const hasConfiguration = !!nodeType.configuration

    const [accordionValue, setAccordionValue] = useState(hasConfiguration ? "options" : null)

    const numUnconnectedInputs = Object.values(displayProps.inputConnections).reduce((sum, cur) => sum + !cur, 0)
    const numOutputs = latestRun?.outputs?.[node.id] ? Object.keys(latestRun?.outputs?.[node.id]).length : 0
    const numErrors = latestRun?.errors?.[node.id]?.length ?? 0

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

                                <ActionIcon radius="md" onClick={() => deselectNode(rf, node.id)}>
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

                                {nodeType.outputs?.length > 0 &&
                                    <Accordion.Item value="testing">
                                        <Accordion.Control>
                                            <AccordionTitle
                                                active={accordionValue == "testing"}
                                                icon={numOutputs > 0 && <Text size="xs">{numOutputs}</Text>}
                                                iconProps={{ color: "gray" }}
                                            >
                                                Outputs
                                            </AccordionTitle>
                                        </Accordion.Control>
                                        <Accordion.Panel>
                                            {numOutputs > 0 ?
                                                <Table highlightOnHover withColumnBorders withBorder>
                                                    <thead>
                                                        <tr>
                                                            <th style={{ whiteSpace: "nowrap" }}>Output</th>
                                                            <th>Last Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(latestRun.outputs[node.id])
                                                            .sort((a, b) => a > b)
                                                            .map(
                                                                ([key, val]) => <tr key={key}>
                                                                    <td style={{ whiteSpace: "nowrap" }}>{key}</td>
                                                                    <td>{val.toString()}</td>
                                                                </tr>
                                                            )}
                                                    </tbody>
                                                </Table> :
                                                <Text color="dimmed" size="sm" align="center">No data to show. Try running your flow!</Text>}
                                        </Accordion.Panel>
                                    </Accordion.Item>}

                                <Accordion.Item value="errors">
                                    <Accordion.Control>
                                        <AccordionTitle
                                            active={accordionValue == "errors"}
                                            icon={numErrors > 0 && <Text size="xs">{numErrors}</Text>}
                                            iconProps={{ color: "red" }}
                                        >
                                            Problems
                                        </AccordionTitle>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        {numErrors ?
                                            <Stack>
                                                {latestRun.errors[node.id].map(
                                                    (err, i) => <ErrorRow key={i}>{err.message}</ErrorRow>
                                                )}
                                            </Stack> :
                                            <Text color="dimmed" size="sm" align="center">No problems!</Text>}
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

function AccordionTitle({ children, active, icon, iconProps = {} }) {
    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: active ? -10 : 0 }}
        >
            <Group>
                <Title order={5}>{children}</Title>
                {icon &&
                    <ThemeIcon size="sm" radius="sm" {...iconProps}>
                        {icon}
                    </ThemeIcon>}
            </Group>
        </motion.div>
    )
}


function ErrorRow({ children }) {
    return (
        <Group noWrap align="center">
            <ThemeIcon size="sm" radius="sm" color="red" variant="light">
                <TbExclamationMark />
            </ThemeIcon>
            <Text size="sm">{children}</Text>
        </Group>
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
        reactFlow.deleteElements({ nodes, edges })
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