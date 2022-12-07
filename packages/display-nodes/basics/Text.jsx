import { AlphabetLatin } from "tabler-icons-react"
import { TextInput } from "@mantine/core"

export default {
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,
    valueSources: [" "],

    renderNode: ({ state, setState }) => <Input state={state} setState={setState} size="xs" w={160} />,
}

function Input({ state, setState, ...props }) {
    return <TextInput
        onClick={event => {
            // console.log(event.bubbles)
            event.stopPropagation()
        }}
        value={state.$ ?? ""}
        onChange={event => setState({ $: event.currentTarget.value })}
        placeholder="Type something..."
        {...props}
    />
}