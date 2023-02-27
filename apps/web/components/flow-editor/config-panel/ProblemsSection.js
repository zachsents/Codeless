import { useMemo } from "react"
import { Accordion, ThemeIcon,Text, Stack } from "@mantine/core"

import { useFlowContext } from "../../../modules/context"
import { useNodeConnections } from "@minus/graph-util"
import AccordionTitle from './AccordionTitle'
import ProblemRow from "./ProblemRow"


export default function ProblemsSection({ nodeId, active }) {

    const { latestRun } = useFlowContext()

    const [inputConnections] = useNodeConnections(nodeId)

    const [problems, numErrors, numWarnings] = useMemo(() => {
        const problems = []

        // unconnected inputs
        const numUnconnectedInputs = Object.values(inputConnections).filter(conn => !conn).length
        if (numUnconnectedInputs > 0)
            problems.push({
                type: ProblemType.Warning,
                message: `This node has ${numUnconnectedInputs} input${numUnconnectedInputs == 1 ? " that isn't" : "s that aren't"} connected.`
            })

        // run errors
        latestRun?.errors[nodeId]?.forEach(err => problems.push({
            type: ProblemType.Error,
            message: err.message,
        }))

        const numErrors = problems.filter(prob => prob.type == ProblemType.Error).length
        const numWarnings = problems.filter(prob => prob.type == ProblemType.Warning).length

        return [problems, numErrors, numWarnings]
    }, [latestRun, inputConnections])

    
    return (
        <Accordion.Item value="errors">
            <Accordion.Control>
                <AccordionTitle
                    active={active}
                    rightSection={<>
                        {numErrors > 0 &&
                            <ThemeIcon color="red" size="sm" radius="sm">
                                <Text size="xs">{numErrors}</Text>
                            </ThemeIcon>}
                        {numWarnings > 0 &&
                            <ThemeIcon color="yellow" size="sm" radius="sm">
                                <Text size="xs">{numWarnings}</Text>
                            </ThemeIcon>}
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
    )
}


const ProblemType = {
    Error: "error",
    Warning: "warning",
}