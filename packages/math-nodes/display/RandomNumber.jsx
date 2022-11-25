import { NumberInput, Stack, Switch } from "@mantine/core"
import { useEffect } from "react"
import { Dice3 } from "tabler-icons-react"

export default {
    name: "Random Number",
    description: "Generates a random number.",
    icon: Dice3,
    valueSources: [" "],

    expanded: ({ state, setState }) => {

        useEffect(() => {
            setState({
                min: state.min ?? 1,
                max: state.max ?? 7,
                integer: state.integer ?? true,
            })
        }, [])

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