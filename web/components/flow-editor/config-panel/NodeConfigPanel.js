import { Accordion, ActionIcon, Button, Card, Group, ScrollArea, Stack, Table, Text, useMantineTheme } from "@mantine/core"
import { NodeProvider, useColors, useIntegrationAccounts, useNodeId, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { useAppContext, useReplayContext } from "@web/modules/context"
import { deselectAll, formatHandleName, useCurrentlySelectedNode } from "@web/modules/graph-util"
import { shortRunId } from "@web/modules/runs"
import { jc } from "@web/modules/util"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { TbArrowBarRight, TbArrowBarToRight, TbExternalLink, TbPlugConnected, TbRun, TbX } from "react-icons/tb"
import { useReactFlow } from "reactflow"
import util from "util"
import InputConfig from "../node/InputConfig"
import OutputConfig from "../node/OutputConfig"
import IntegrationAlert from "./IntegrationAlert"


const OFFSCREEN = { x: "120%" }
const ONSCREEN = { x: 0 }
const TRANSITION = {
    duration: 0.4,
    type: "spring",
    bounce: 0.15,
}
const DELAY = 0.05


export default function NodeConfigPanel() {

    const { app } = useAppContext()
    const selectedNode = useCurrentlySelectedNode()

    // Integrations
    const { needsAccounts, missingSelections } = useIntegrationAccounts(selectedNode?.id, app)

    // Accordion state
    const defaultAccordionState = (needsAccounts && missingSelections) ? ["inputs", "integrations"] : ["inputs", "outputs"]
    const [accordionState, setAccordionState] = useState(defaultAccordionState)

    // Side-effect: Open the Integrations tab if there are missing selections
    useEffect(() => {
        if (needsAccounts && missingSelections)
            setAccordionState(defaultAccordionState)
    }, [needsAccounts, missingSelections])

    // Currently selected run
    const { run } = useReplayContext()

    return (
        <AnimatePresence>
            {selectedNode &&
                <NodeProvider value={{ id: selectedNode?.id }}>
                    <Stack spacing="xxs" w="24rem" className="h-full">
                        <TitleCard />

                        <Accordion
                            variant="separated" multiple
                            // I simply have no idea why min-h-0 is needed here, but it works.
                            // https://stackoverflow.com/questions/41674979/flex-child-is-growing-out-of-parent
                            className="flex flex-col gap-xxs flex-1 min-h-0"
                            classNames={{
                                item: "pointer-events-auto bg-white base-border shadow-xs !m-0 " +
                                    "flex flex-col h-full",
                                panel: "min-h-0 [&>div]:h-full",
                                content: "h-full p-0",
                                label: "py-xxxs",
                            }}
                            styles={{
                                item: {
                                    // When the Accordion opens and closes, it sets the height of the panel to 0.
                                    // This fixes that.
                                    "&[data-active=\"true\"] > div": { height: "auto !important" }
                                }
                            }}
                            value={accordionState}
                            onChange={setAccordionState}
                        >

                            <AnimAccordionItem
                                title="Inputs"
                                value="inputs"
                                icon={<TbArrowBarToRight />}
                            >
                                <InputsPanel />
                            </AnimAccordionItem>

                            <AnimAccordionItem
                                title="Outputs"
                                value="outputs"
                                icon={<TbArrowBarRight />}
                            >
                                <OutputsPanel />
                            </AnimAccordionItem>

                            {needsAccounts &&
                                <AnimAccordionItem
                                    title="Integrations"
                                    value="integrations"
                                    icon={<TbPlugConnected />}
                                >
                                    <IntegrationsPanel />
                                </AnimAccordionItem>}

                            {run && <>
                                <AnimAccordionItem
                                    title={<>Inputs - Run <Text span color="primary">{shortRunId(run.id)}</Text></>}
                                    value="run-inputs"
                                    icon={<RunInputsIcon />}
                                >
                                    <RunInputsPanel />
                                </AnimAccordionItem>

                                <AnimAccordionItem
                                    title={<>Outputs - Run <Text span color="primary">{shortRunId(run.id)}</Text></>}
                                    value="run-outputs"
                                    icon={<RunOutputsIcon />}
                                >
                                    <RunOutputsPanel />
                                </AnimAccordionItem>
                            </>}
                        </Accordion>
                    </Stack>
                </NodeProvider>}
        </AnimatePresence>
    )
}


function AnimAccordionItem({ value, children, title, icon }) {

    const ref = useRef()
    const itemRef = useRef()

    const siblings = ref.current?.parentElement?.children
    const index = siblings ? [...siblings].indexOf(ref.current) : 0
    // const index = siblings && [...siblings].indexOf(ref.current)

    return (
        <motion.div
            initial={OFFSCREEN}
            animate={ONSCREEN}
            exit={{
                ...OFFSCREEN,
                transition: {
                    delay: DELAY * (index + 2),
                }
            }}
            transition={TRANSITION}
            className={jc(
                "min-h-0",
                itemRef.current?.getAttribute("data-active") == "true" && "flex-1"
            )}
            ref={ref}
        >
            <Accordion.Item value={value} ref={itemRef}>
                <Accordion.Control icon={icon}>
                    <Text size="sm" weight={500}>{title}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                    <ScrollArea.Autosize
                        mah="100%" offsetScrollbars
                        // Need this for horizontal scrollbars to work
                        className="[&>div]:w-full"
                        classNames={{
                            viewport: "px-md pt-xs pb-xl"
                        }}
                    >
                        {children}
                    </ScrollArea.Autosize>
                </Accordion.Panel>
            </Accordion.Item>
        </motion.div>
    )
}


function TitleCard() {

    const rf = useReactFlow()

    const typeDefinition = useTypeDefinition()
    const [mainColor] = useColors(null, ["primary"])

    return typeDefinition &&
        <Card
            withBorder shadow="xs" px="sm" py="xxs"
            className="pointer-events-auto shrink-0"

            component={motion.div}
            initial={OFFSCREEN}
            animate={ONSCREEN}
            exit={{
                ...OFFSCREEN,
                transition: {
                    delay: DELAY,
                }
            }}
            transition={TRANSITION}
        >
            <Group position="apart">
                <Group spacing="sm">
                    {/* Icon */}
                    {/* <ThemeIcon color={typeDefinition.color}>
                    <typeDefinition.icon size="1em" strokeWidth={1.5} />
                </ThemeIcon> */}
                    <typeDefinition.icon color={mainColor} size="1.25rem" strokeWidth={1.5} />

                    {/* Name */}
                    <Text size="sm" weight={500}>
                        {typeDefinition.renderName ? <typeDefinition.renderName /> : typeDefinition.name}
                    </Text>
                </Group>

                <Group>
                    {/* <ActionIcon size="sm" radius="sm" color="red">
                        <TbTrash size="0.75em" />
                    </ActionIcon> */}
                    <ActionIcon size="sm" radius="sm" onClick={() => deselectAll(rf)}>
                        <TbX size="1em" />
                    </ActionIcon>
                </Group>
            </Group>
        </Card>
}


function InputsPanel() {

    const typeDefinition = useTypeDefinition()

    return typeDefinition &&
        <Stack spacing="md">
            {typeDefinition.inputs.length ?
                typeDefinition.inputs.map((input, i) =>
                    <InputConfig id={input.id} divider={i != 0} key={input.id} />
                ) :
                <Text align="center" size="sm" color="dimmed">
                    No Inputs
                </Text>}
        </Stack>
}

function OutputsPanel() {

    const typeDefinition = useTypeDefinition()

    return typeDefinition &&
        <Stack spacing="sm">
            {typeDefinition.outputs.length ?
                typeDefinition.outputs.map((output, i) =>
                    <OutputConfig id={output.id} divider={i != 0} key={output.id} />
                ) :
                <Text align="center" size="sm" color="dimmed">
                    No Outputs
                </Text>}
        </Stack>
}

function IntegrationsPanel() {

    const { app } = useAppContext()
    const { requiredIntegrations } = useIntegrationAccounts(null, app)

    return (
        <Stack spacing="xs">
            <Group position="right">
                <Button
                    component="a"
                    href={`/app/${app?.id}?tab=integrations`}
                    target="_blank"
                    rightIcon={<TbExternalLink />}
                    size="xs" compact variant="subtle" color="gray"
                >
                    Manage Accounts
                </Button>
            </Group>

            <Stack spacing="xs" px="sm">
                {requiredIntegrations.map(integrationId =>
                    <IntegrationAlert id={integrationId} key={integrationId} />
                )}
            </Stack>
        </Stack>
    )
}


function RunInputsPanel() {

    const { run } = useReplayContext()
    const nodeId = useNodeId()
    const typeDefinition = useTypeDefinition()

    return <DataTable
        data={run?.inputs?.[nodeId] ?? {}}
        definitions={Object.fromEntries(typeDefinition.inputs.map(input => [input.id, input]))}
    />
}


function RunOutputsPanel() {

    const { run } = useReplayContext()
    const nodeId = useNodeId()
    const typeDefinition = useTypeDefinition()

    return <DataTable
        data={run?.outputs?.[nodeId] ?? {}}
        definitions={Object.fromEntries(typeDefinition.outputs.map(output => [output.id, output]))}
    />
}


function DataTable({ data: rawData, definitions, emptyMessage = "No Data" }) {

    const theme = useMantineTheme()

    // Format the data for display
    const data = Object.entries(rawData).flatMap(([key, values]) => {

        const definition = definitions?.[key]

        // Named lists
        if (definition?.listMode === "named") {
            return Object.entries(values).map(([subKey, subValues]) => {

                if (!Array.isArray(subValues))
                    subValues = [subValues]

                return {
                    key: `${key} ${subKey}`,
                    label: <Group spacing="xs" noWrap key={`${key}-${subKey}`}>
                        {definition?.icon &&
                            <definition.icon size={theme.fontSizes.sm} />}

                        <Text>
                            {definition?.name || formatHandleName(key)} - {subKey}
                        </Text>
                    </Group>,
                    values: subValues.map(el => formatValue(el))
                }
            })
        }

        // Make sure we're dealing with an array from this point on
        if (!Array.isArray(values))
            values = [values]

        // Unnamed lists
        if (definition?.listMode === "unnamed") {
            // Check if this was an unnamed list that got stringified because of double arrays
            const parsedArrays = Array.isArray(values) && values.map(v => {
                try { return JSON.parse(v) }
                catch { return false }
            })

            if (parsedArrays.every(v => Array.isArray(v)))
                return parsedArrays.map((arr, i) => ({
                    key: `${key} ${i + 1}`,
                    label: <Group spacing="xs" noWrap key={`${key}-${i}`}>
                        {definition?.icon &&
                            <definition.icon size={theme.fontSizes.sm} />}
                        <Text>
                            {definition?.name || formatHandleName(key)} {i + 1}
                        </Text>
                    </Group>,
                    values: arr.map(el => formatValue(el))
                }))
        }

        // Regular values
        return {
            key: key,
            label: <Group spacing="xs" noWrap key={key}>
                {definition?.icon &&
                    <definition.icon size={theme.fontSizes.sm} />}
                <Text>
                    {definition?.name || formatHandleName(key)}
                </Text>
            </Group>,
            values: values.map(v => formatValue(v)),
        }
    })

    // Find the longest array of values
    const longestLength = Math.max(...data.map(item => item.values.length))

    const thClasses = "text-xs text-left px-xs py-xxs whitespace-nowrap bg-gray-200 last:rounded-r-md"

    return data.length > 0 ?
        <Table>
            <thead>
                <th className={jc(thClasses, "rounded-l-md")}>Input</th>

                {longestLength == 1 ?
                    <th className={thClasses}>Value</th> :
                    Array(longestLength).fill().map((_, i) =>
                        <th className={thClasses} key={i}>Value {i + 1}</th>
                    )}
            </thead>
            <tbody>
                {data.map(item =>
                    <tr className="border-solid border-0 border-b-1 border-gray-400 last:border-b-0" key={item.key}>
                        <td className="whitespace-nowrap !border-none w-0 !pr-lg">{item.label ?? item.key}</td>

                        {item.values.map((value, i) =>
                            <td className="whitespace-pre !border-none" key={i}>{value}</td>
                        )}
                    </tr>
                )}
            </tbody>
        </Table> :
        <Text align="center" size="sm" color="dimmed">
            {emptyMessage}
        </Text>
}


function RunInputsIcon(props) {

    return <Group spacing={0}>
        <TbArrowBarToRight {...props} />
        <TbRun {...props} />
    </Group>
}


function RunOutputsIcon(props) {

    return <Group spacing={0}>
        <TbRun {...props} />
        <TbArrowBarRight {...props} />
    </Group>
}


function formatValue(value) {
    if (typeof value == "string")
        return value

    // In the future, we might use this to display objects in a nicer way
    // return <DataViewer data={value} topLevel key={Math.random().toString(16).slice(2, 10)} />

    return util.inspect(value, {
        depth: 5,
        colors: false,
        compact: false,
    })
}