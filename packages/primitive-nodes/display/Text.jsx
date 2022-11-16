import { AlphabetLatin } from "tabler-icons-react"
import { TextInput } from "@mantine/core"

export default {
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,
    valueSources: [" "],

    sm: ({ state, setState }) => <Input state={state} setState={setState} size="xs" w={160} />,
    md: ({ state, setState }) => <Input state={state} setState={setState} size="sm" w={180} />,
    lg: ({ state, setState }) => <Input state={state} setState={setState} size="md" w={200} />,
}

function Input({ state, setState, ...props }) {
    return <TextInput
        value={state.$}
        onChange={event => setState({ $: event.currentTarget.value })}
        placeholder="Type something..."
        {...props}
    />
}