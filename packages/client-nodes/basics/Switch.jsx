import { CircuitSwitchOpen } from "tabler-icons-react"
import { Center, Switch } from "@mantine/core"

export default {
    id: "basic:Switch",
    name: "Switch",
    description: "Just on or off. True or false.",
    icon: CircuitSwitchOpen,

    inputs: [],
    outputs: ["$"],

    defaultState: { $: false },

    renderNode: ({ state, setState, alignHandles }) => {
        return (
            <Center ref={el => alignHandles("$", el)}>
                <Switch
                    color="green"
                    mt={4}
                    checked={state.$ ?? false}
                    onChange={event => setState({ $: event.currentTarget.checked })}
                />
            </Center>
        )
    },
}
