import { Accordion, Text, Table } from "@mantine/core"

import { useFlowContext } from "../../../modules/context"
import AccordionTitle from "./AccordionTitle"


export default function OutputsSection({ nodeId, active }) {

    const { latestRun } = useFlowContext()

    const numOutputs = latestRun?.outputs?.[nodeId] ? Object.keys(latestRun?.outputs?.[nodeId]).length : 0

    return (
        <Accordion.Item value="testing">
            <Accordion.Control>
                <AccordionTitle
                    active={active}
                    icon={numOutputs > 0 &&
                        <Text size="xs">{numOutputs}</Text>}
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
                            {Object.entries(latestRun.outputs[nodeId])
                                .sort((a, b) => a > b)
                                .map(
                                    ([key, val]) => <tr key={key}>
                                        <td style={{ whiteSpace: "nowrap" }}>{key}</td>
                                        <td>
                                            <Text sx={{ whiteSpace: "pre-wrap" }}>
                                                {val?.length == 1 ? val[0]?.toString() : val?.toString()}
                                            </Text>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table> :
                    <Text color="dimmed" size="sm" align="center">No data to show. Try running your flow!</Text>}
            </Accordion.Panel>
        </Accordion.Item>
    )
}
