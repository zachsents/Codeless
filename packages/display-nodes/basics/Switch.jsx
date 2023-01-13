import { CircuitSwitchOpen } from "tabler-icons-react"
import { Switch } from "@mantine/core"

export default {
    id: "basic:Switch",
    name: "Switch",
    description: "Just on or off. True or false.",
    icon: CircuitSwitchOpen,
    
    inputs: [],
    outputs: ["$"],

    defaultState: { $: false },

    renderNode: ({ state, setState }) => {
        return (
            <Switch
                mt={5}
                // size="xl"
                checked={state.$ ?? false}
                onChange={event => setState({ $: event.currentTarget.checked })}
            />
        )
    },
}
