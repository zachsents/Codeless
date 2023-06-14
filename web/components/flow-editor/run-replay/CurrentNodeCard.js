import { Box, Button, Center, Stack, Table, Tabs, Text } from "@mantine/core"
import { useHandleDefinition, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import DataViewer from "@web/components/DataViewer"
import SlidingCard from "@web/components/SlidingCard"
import { openDataViewer } from "@web/components/modals/DataViewerModal"
import { useReplayContext } from "@web/modules/context"
import { formatHandleName, useCurrentlySelectedNode } from "@web/modules/graph-util"
import { forwardRef } from "react"


export default function CurrentNodeCard() {

    const { run } = useReplayContext()

    const selectedNode = useCurrentlySelectedNode()
    const typeDefinition = useTypeDefinition(selectedNode?.id)

    // WILO: moving this to the config panel accordion

    return (
        <SlidingCard opened={!!selectedNode}
            withBorder p="xs" shadow="md" w="15rem" className="pointer-events-auto"
        >
            <Stack spacing="xs">
                <Box>
                    <Text size="xs" color="dimmed">Run Data</Text>
                    <Text size="sm" weight={500}>{typeDefinition?.name}</Text>
                </Box>

                {selectedNode &&
                    <Tabs defaultValue="inputs" variant="pills" classNames={{ tab: "text-xs h-6" }}>
                        <Tabs.List grow>
                            <Tabs.Tab value="inputs">Inputs</Tabs.Tab>
                            <Tabs.Tab value="outputs">Outputs</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="inputs" pt="xs">
                            {run.inputs?.[selectedNode.id] ?
                                <ValueTable node={selectedNode} typeKey="inputs" noun="Input" /> :
                                <Text color="dimmed" size="sm" align="center">No data</Text>}
                        </Tabs.Panel>

                        <Tabs.Panel value="outputs" pt="xs">
                            {run.outputs?.[selectedNode.id] ?
                                <ValueTable node={selectedNode} typeKey="outputs" noun="Output" /> :
                                <Text color="dimmed" size="sm" align="center">No data</Text>}
                        </Tabs.Panel>
                    </Tabs>}
            </Stack>
        </SlidingCard>
    )
}


const ValueTable = forwardRef(({ node, typeKey, noun }, ref) => {

    const typeDefinition = useTypeDefinition(node.id)
    const { run } = useReplayContext()
    const fullData = run[typeKey]?.[node.id]

    return typeDefinition?.[typeKey]?.length ? <>
        <Table ref={ref}>
            <tbody>
                {typeDefinition[typeKey].map(handle =>
                    <ValueRow nodeId={node.id} handleId={handle.id} typeKey={typeKey}
                        key={handle.id} />
                )}
            </tbody>
        </Table>
        <Center>
            <Button compact size="xs" variant="subtle" onClick={() => openDataViewer(fullData, {
                title: "Data for " + typeDefinition.name,
            })}>
                Expand
            </Button>
        </Center>
    </> :
        <Text align="center" size="sm" color="dimmed">
            No {noun}s
        </Text>
})
ValueTable.displayName = "ValueTable"


function ValueRow({ nodeId, handleId, typeKey }) {

    const { definition } = useHandleDefinition(nodeId, handleId)
    const { run } = useReplayContext()

    const handleLabel = definition.name || formatHandleName(definition.id)

    const data = run[typeKey]?.[nodeId]?.[handleId]

    return <tr>
        <td>{handleLabel}</td>
        <td>
            <Center>
                {data === undefined ?
                    <Text color="dimmed" size="sm">No data</Text> :
                    DataViewer.requiresExpansion(data) ?
                        <Button
                            onClick={() => openDataViewer(data, {
                                title: "Data for " + handleLabel,
                            })}
                            size="xs" compact color="gray" variant="light"
                        >
                            View Data
                        </Button> :
                        <DataViewer data={data} topLevel textProps={{
                            className: "line-clamp-3",
                        }} />}
            </Center>
        </td>
    </tr>
}
