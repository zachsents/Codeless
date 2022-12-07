import { ArrowBarRight } from "tabler-icons-react"
import { TextInput } from "@mantine/core"

export default {
    name: "Get Property",
    description: "Reads a property from an object.",
    icon: ArrowBarRight,
    valueTargets: ["object"],
    valueSources: ["property"],

    renderNode: ({ state, setState }) => {
        return (
            <TextInput
                value={state.$ ?? ""}
                onChange={event => setState({ $: event.currentTarget.value })}
                size="xs"
                w={100}
                placeholder="Property name"
            />
        )
    },
}