import { NumberInput, Stack, Switch, Group } from "@mantine/core"
import { Dice3 } from "tabler-icons-react"

export default {
    id: "math:RandomNumber",
    name: "Random Number",
    description: "Generates a random number.",
    icon: Dice3,
    
    inputs: [],
    outputs: ["$"],

    defaultState: {
        min: 1,
        max: 7,
        integer: true,
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