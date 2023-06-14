import { Box, Switch } from "@mantine/core"
import { CircuitSwitchOpen } from "tabler-icons-react"
import { useInternalState } from "../hooks/nodes"

export default {
    id: "basic:Switch",
    name: "Switch",
    description: "Just on or off. True or false.",
    icon: CircuitSwitchOpen,

    tags: ["Basics"],
    showMainTag: false,

    inputs: [],
    outputs: [
        {
            id: "$",
            // name: "True / False",
            description: "The switch's value.",
            tooltip: "The switch's value.",
            icon: CircuitSwitchOpen,
        }
    ],

    defaultState: { $: false },

    renderName: false,
    renderCard: false,

    renderContent: () => {
        const [state, setState] = useInternalState()
        return <Box py="sm" px="xxxs">
            <Switch
                checked={state.$ ?? false}
                onChange={event => setState({ $: event.currentTarget.checked })}
                color="green"
                size="lg"
                onLabel="ON"
                offLabel="OFF"
            />
        </Box>
    },
}
