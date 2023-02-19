import { useState, useCallback, useMemo } from 'react'
import { useOnSelectionChange, useReactFlow } from 'reactflow'
import { ActionIcon, Box, Card, Group, Text, Stack, Tooltip, Title, ThemeIcon, Badge, ScrollArea, useMantineTheme, Accordion, Flex, Table, Alert, Button, Center } from '@mantine/core'
import { motion, AnimatePresence } from "framer-motion"
import { TbAlertTriangle, TbChevronLeft, TbChevronRight, TbExclamationMark, TbTrash, TbX } from "react-icons/tb"

import { deselectNode, getNodeType, useNodeDisplayProps, useNodeDragging } from '../../modules/graph-util'
import { useAppContext, useFlowContext } from '../../modules/context'
import create from "zustand"
import { produce } from "immer"
import { Integrations } from '@minus/client-nodes'


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


const useConfigStore = create(set => ({
    actions: {
        setAccordionValue: (id, val) => set(produce(draft => {
            draft[id] ??= {}
            draft[id].accordionValue = val
        })),
        togglePanelMaximized: id => set(produce(draft => {
            draft[id] ??= {}
            draft[id].panelMaximized = !draft[id].panelMaximized
        })),
    },
}))


function NodeConfig({ node }) {

    const rf = useReactFlow()
    const theme = useMantineTheme()

    const { app } = useAppContext()
    const { latestRun } = useFlowContext()
    const displayProps = useNodeDisplayProps(node.id)
    const nodeType = getNodeType(node)
    const hasConfiguration = !!nodeType.configuration

    // pull some state from config store -- doesn't need to be persisted between refreshes 
    const panelMaximized = useConfigStore(s => s[node.id]?.panelMaximized ?? false)
    const accordionValue = useConfigStore(s => s[node.id]?.accordionValue)
    const { togglePanelMaximized, setAccordionValue } = useConfigStore(s => s.actions)

    // calculate some numbers
    const numUnconnectedInputs = Object.values(displayProps.inputConnections).reduce((sum, cur) => sum + !cur, 0)
    const numOutputs = latestRun?.outputs?.[node.id] ? Object.keys(latestRun?.outputs?.[node.id]).length : 0

    // problems
    const [problems, numErrors, numWarnings] = useMemo(() => {
        const problems = []

        if (numUnconnectedInputs > 0)
            problems.push({
                type: ProblemType.Warning,
                message: `This node has ${numUnconnectedInputs} input${numUnconnectedInputs == 1 ? " that isn't" : "s that aren't"} connected.`
            })

        latestRun?.errors[node.id]?.forEach(err => problems.push({
            type: ProblemType.Error,
            message: err.message,
        }))

        const numErrors = problems.filter(prob => prob.type == ProblemType.Error).length
        const numWarnings = problems.filter(prob => prob.type == ProblemType.Warning).length

        return [problems, numErrors, numWarnings]
    }, [latestRun, numUnconnectedInputs])


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
                        radius="md" shadow="sm" mah="100%"
                        sx={{ pointerEvents: "all", overflow: "visible" }}

                        component={motion.div}
                        animate={{ width: panelMaximized ? 500 : 300 }}
                        transition={{ type: "spring", duration: 0.3, spring: 0.5 }}
                    >
                        <Stack spacing="xl">

                            {/* Header */}
                            <Group spacing="xs" position="apart" noWrap align="start">
                                <Stack spacing="xs">
                                    <ActionIcon
                                        onClick={() => togglePanelMaximized(node.id)}
                                        radius="md"
                                        variant="light"
                                    >
                                        {panelMaximized ? <TbChevronRight /> : <TbChevronLeft />}
                                    </ActionIcon>

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

                            {nodeType.requiredIntegrations?.map(intId => {
                                const int = Integrations[intId]
                                return int.manager.isAppAuthorized(app) ?
                                    <Alert
                                        pb={5}
                                        title={<Group spacing={5}>Connected to <int.icon /> {int.name}</Group>}
                                        color="green"
                                        key={int.id}
                                    /> :
                                    <Alert title="Integration Required!" color="red" key={int.id}>
                                        This node uses <b>{int.name}</b>.
                                        <Center mt="xs">
                                            <Button compact color={int.color} onClick={() => int.manager.oneClickAuth(app.id)}>
                                                <Group spacing={5}>Connect <int.icon /> {int.name}</Group>
                                            </Button>
                                        </Center>
                                    </Alert>
                            })}

                            {/* Body */}
                            <Accordion
                                variant="separated"
                                value={accordionValue === undefined ? (hasConfiguration ? "options" : null) : accordionValue}
                                onChange={val => setAccordionValue(node.id, val)}
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
                                                <nodeType.configuration {...displayProps} maximized={panelMaximized} />}
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
                                                                    <td>
                                                                        <Text sx={{ whiteSpace: "pre-wrap" }}>
                                                                            {val?.length == 1 ? val[0] : val?.toString()}
                                                                        </Text>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                    </tbody>
                                                </Table> :
                                                <Text color="dimmed" size="sm" align="center">No data to show. Try running your flow!</Text>}
                                        </Accordion.Panel>
                                    </Accordion.Item>}

                                {/* Problems */}
                                <Accordion.Item value="errors">
                                    <Accordion.Control>
                                        <AccordionTitle
                                            active={accordionValue == "errors"}
                                            rightSection={<>
                                                {numErrors > 0 && <SmallIcon color="red"><Text size="xs">{numErrors}</Text></SmallIcon>}
                                                {numWarnings > 0 && <SmallIcon color="yellow"><Text size="xs">{numWarnings}</Text></SmallIcon>}
                                            </>}
                                        >
                                            Problems
                                        </AccordionTitle>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        {problems.length ?
                                            <Stack>
                                                {problems.map(
                                                    (prob, i) => <ProblemRow type={prob.type} key={i}>{prob.message}</ProblemRow>
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

const ProblemType = {
    Error: "error",
    Warning: "warning",
}

const configContainerStyle = theme => ({
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "none",
    zIndex: 100,
    // padding: theme.spacing.lg,
    width: 600,
    // display: "flex",
    // flexDirection: "column",
    // justifyContent: "flex-start",
    // alignItems: "flex-end",
})

function AccordionTitle({ children, active, icon, iconProps = {}, rightSection }) {
    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: active ? -10 : 0 }}
        >
            <Group>
                <Title order={5}>{children}</Title>
                {icon &&
                    <SmallIcon {...iconProps}>
                        {icon}
                    </SmallIcon>}
                {rightSection}
            </Group>
        </motion.div>
    )
}


function SmallIcon({ children, ...props }) {
    return <ThemeIcon size="sm" radius="sm" {...props}>
        {children}
    </ThemeIcon>
}


function ProblemRow({ children, type = ProblemType.Error }) {

    const color = type == ProblemType.Error ? "red" : "yellow"
    const icon = type == ProblemType.Error ? <TbExclamationMark /> : <TbAlertTriangle />

    return (
        <Group noWrap align="center">
            <ThemeIcon size="sm" radius="sm" color={color} variant="light">
                {icon}
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