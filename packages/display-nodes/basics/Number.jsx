import { Numbers } from "tabler-icons-react"
import { NumberInput } from "@mantine/core"

export default {
    id: "basic:Number",
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,

    inputs: [],
    outputs: ["$"],

    renderNode: ({ state, setState }) => (
        <NumberInput
            value={state.$}
            onChange={val => setState({ $: val })}
            placeholder="25"
            radius="md"
            size="xs"
            m={-5}
            w={80}
        />
    ),
}
