import { AlphabetLatin } from "tabler-icons-react"
import { TextInput } from "@mantine/core"

export default {
    id: "basic:Text",
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,

    inputs: [],
    outputs: ["$"],

    renderNode: ({ state, setState }) => (
        <TextInput
            value={state.$ ?? ""}
            onChange={event => setState({ $: event.currentTarget.value })}
            placeholder="Type something..."
            m={-5}
            size="xs" w={160}
        />
    ),
}
