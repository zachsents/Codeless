import { ArrowRightSquare } from "tabler-icons-react"
import { TextInput } from "@mantine/core"

export default {
    name: "Get Property",
    description: "Reads a property from a bundle.",
    icon: ArrowRightSquare,
    valueTargets: ["object"],
    valueSources: ["property"],

    default: ({ state, setState }) => {
        return (
            <TextInput
                value={state.$ ?? ""}
                onChange={event => setState({ $: event.currentTarget.value })}
                size="xs"
                w={100}
                placeholder="Item name"
            />
        )
    },
}