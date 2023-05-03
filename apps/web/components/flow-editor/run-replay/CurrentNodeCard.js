import { Button, Code, Table, Text } from "@mantine/core"
import { useHandleDefinition, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import AnimatedTabs from "@web/components/AnimatedTabs"
import DataViewer from "@web/components/DataViewer"
import SlidingCard from "@web/components/SlidingCard"
import { openDataViewer } from "@web/components/modals/DataViewerModal"
import { useReplayContext } from "@web/modules/context"
import { formatHandleName, useCurrentlySelectedNode } from "@web/modules/graph-util"
import { forwardRef, useState } from "react"
import util from "util"


export default function CurrentNodeCard() {

    const { run } = useReplayContext()
    const [tab, setTab] = useState("Inputs")

    const selectedNode = useCurrentlySelectedNode()

    return (
        <SlidingCard opened={!!selectedNode} withBorder>
            {selectedNode &&
                <AnimatedTabs
                    tabs={["Inputs", "Outputs"]}
                    active={tab}
                    onChange={setTab}
                >
                    {run.inputs?.[selectedNode.id] ?
                        <ValueTable node={selectedNode} typeKey="inputs" noun="Input" /> :
                        <Text color="dimmed" size="sm" align="center">No data</Text>}

                    {run.outputs?.[selectedNode.id] ?
                        <ValueTable node={selectedNode} typeKey="outputs" noun="Output" /> :
                        <Text color="dimmed" size="sm" align="center">No data</Text>}
                </AnimatedTabs>}
        </SlidingCard>
    )
}


const ValueTable = forwardRef(({ node, typeKey, noun }, ref) => {

    const typeDefinition = useTypeDefinition(node.id)

    return typeDefinition?.[typeKey]?.length ?
        <Table maw={300} ref={ref}>
            <thead>
                <tr>
                    <th>{noun}</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {typeDefinition[typeKey].map(handle =>
                    <ValueRow nodeId={node.id} handleId={handle.id} typeKey={typeKey}
                        key={handle.id} />
                )}
            </tbody>
        </Table> :
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
                    <Code>{util.inspect(data)}</Code>}
        </td>
    </tr>
}
