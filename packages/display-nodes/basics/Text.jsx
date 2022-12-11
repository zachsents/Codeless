import { AlphabetLatin } from "tabler-icons-react"
import { TextInput } from "@mantine/core"

export default {
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,
    valueSources: [" "],

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
