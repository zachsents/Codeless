import { NumberInput, Stack, Switch } from "@mantine/core"
import { Dice3 } from "tabler-icons-react"

export default {
    name: "Random Number",
    description: "Generates a random number.",
    icon: Dice3,
    valueSources: [" "],

    defaultState: {
        min: 1,
        max: 7,
        integer: true,
    },

    expanded: ({ state, setState }) => {
        return (
            <Stack spacing="xs" align="center" w={130}>
                <NumberInput value={state.min ?? 0} onChange={val => setState({ min: val })} {...inputProps} />
                <NumberInput value={state.max ?? 0} onChange={val => setState({ max: val })} {...inputProps} />
                <Switch checked={state.integer ?? false} onChange={event => setState({ integer: event.currentTarget.checked })} size="xs" label="Integers only" />
            </Stack>
        )
    }
}

const inputProps = {
    placeholder: "1",
    label: "Min",
    size: "xs",
    radius: "md",
}