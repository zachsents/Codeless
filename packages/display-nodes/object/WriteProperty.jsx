import { ArrowBarToRight } from "tabler-icons-react"
import { TextInput } from "@mantine/core"

export default {
    name: "Set Property",
    description: "Sets a property on an object.",
    icon: ArrowBarToRight,
    valueTargets: ["object", "value"],
    valueSources: ["out"],

    default: ({ state, setState }) => {
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