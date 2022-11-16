import { Numbers } from "tabler-icons-react"
import { NumberInput } from "@mantine/core"

export default {
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,
    valueSources: [" "],

    sm: ({ state, setState }) => <Input state={state} setState={setState} size="xs" w={100} /> ,
    md: ({ state, setState }) => <Input state={state} setState={setState} size="sm" w={120} /> ,
    lg: ({ state, setState }) => <Input state={state} setState={setState} size="md" w={140} /> ,
}

function Input({ state, setState, ...props }) {
    return <NumberInput
        value={state.$}
        onChange={val => setState({ $: val })}
        placeholder="25"
        radius="md"
        {...props}
    />
}