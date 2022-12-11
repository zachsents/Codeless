import { Numbers } from "tabler-icons-react"
import { NumberInput } from "@mantine/core"

export default {
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,
    valueSources: [" "],

    renderNode: ({ state, setState }) => (
        <NumberInput
            value={state.$}
            onChange={val => setState({ $: val })}
            placeholder="25"
            m={-5}
            size="xs"
            w={80}
        />
    ),
}
