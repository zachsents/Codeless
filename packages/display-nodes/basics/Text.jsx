import { AlphabetLatin } from "tabler-icons-react"
import { Textarea, TextInput } from "@mantine/core"

export default {
    id: "basic:Text",
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,

    inputs: [],
    outputs: ["$"],

    renderNode: ({ state, setState }) => (
        <Textarea
            value={state.$ ?? ""}
            onChange={event => setState({ $: event.currentTarget.value })}
            placeholder="Type something..."
            radius="md"
            m={-5}
            size="xs"
            maw={160}
            autosize
            minRows={1}
        />
        
    ),
}
