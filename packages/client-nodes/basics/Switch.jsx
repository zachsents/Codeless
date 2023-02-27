import { CircuitSwitchOpen } from "tabler-icons-react"
import { Center, Switch } from "@mantine/core"

import { useAlignHandles, useNodeState } from "@minus/graph-util"


export default {
    id: "basic:Switch",
    name: "Switch",
    description: "Just on or off. True or false.",
    icon: CircuitSwitchOpen,

    inputs: [],
    outputs: ["$"],

    defaultState: { $: false },

    renderNode: () => {

        const [state, setState] = useNodeState()
        const alignHandle = useAlignHandles()

        return (
            <Center ref={alignHandle("$")}>
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
