import { Group, NumberInput, Text } from "@mantine/core"
import { useEffect } from "react"
import { Clock } from "tabler-icons-react"

export default {
    name: "Delay",
    description: "Delays a signal.",
    icon: Clock,
    valueTargets: ["time"],
    signalTargets: ["in"],
    signalSources: ["out"],

    configuration: ({ state, setState, connections }) => {

        useEffect(() => {
            connections.time && setState({ time: null })
        }, [connections.time])

        return <Group>
            <NumberInput
                disabled={connections.time}
                value={state.time ?? null}
                onChange={val => setState({ time: val })}
                placeholder="Time"
                w={100}
                step={0.1}
                precision={1}
            />
            <Text size="xs">{state.time == 1 ? "second" : "seconds"}</Text>
        </Group>
    },
}