import { CircuitSwitchOpen } from "tabler-icons-react"
import { Switch } from "@mantine/core"

export default {
    name: "Switch",
    description: "Just on or off. True or false.",
    icon: CircuitSwitchOpen,
    valueSources: [" "],

    renderNode: ({ state, setState }) => {
        return (
            <Switch
                mt={-10}
                // size="xl"
                checked={state.$ ?? false}
                onChange={event => setState({ $: event.currentTarget.checked })}
            />
        )
    },
}
