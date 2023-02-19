import { NumberInput, Stack, Switch, Group, Text } from "@mantine/core"
import { Dice3 } from "tabler-icons-react"

export default {
    id: "math:RandomNumber",
    name: "Random Number",
    description: "Generates a random number.",
    icon: Dice3,
    badge: "Math",

    inputs: [],
    outputs: ["$"],

    defaultState: {
        min: 1,
        max: 7,
        integer: true,
    },

    renderNode: ({ state, alignHandles }) => {
        return (
            <Text size="xs" color="dimmed" align="center" ref={el => alignHandles("$", el)}>
                {state.integer ? "Integer" : "Number"} between {state.min} and {state.max}
            </Text>
        )
    },

    configuration: ({ state, setState }) => {
        return (
            <Stack spacing="xs" align="center">
                <Group w={240} grow>
                    <NumberInput value={state.min ?? 0} onChange={val => setState({ min: val })} {...inputProps} />
                    <NumberInput value={state.max ?? 0} onChange={val => setState({ max: val })} {...inputProps} />
                </Group>
                <Switch checked={state.integer ?? false} onChange={event => setState({ integer: event.currentTarget.checked })} label="Integers only" />
            </Stack>
        )
    }
}

const inputProps = {
    placeholder: "1",
    label: "Min",
    radius: "md",
}