import { AlphabetLatin } from "tabler-icons-react"
import { Box, Textarea, TextInput } from "@mantine/core"

export default {
    id: "basic:Text",
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,
    badge: "Text",

    inputs: [],
    outputs: ["$"],

    renderNode: ({ state, setState, alignHandles }) => (
        <Box ref={el => alignHandles("$", el)}>
            <Textarea
                value={state.$ ?? ""}
                onChange={event => setState({ $: event.currentTarget.value })}
                placeholder="Type something..."
                radius="md"
                size="xs"
                autosize
                minRows={1}
                maxRows={15}
            />
        </Box>
    ),
}
