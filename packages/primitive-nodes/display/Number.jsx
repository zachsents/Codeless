import { Numbers } from "tabler-icons-react"
import { NumberInput } from "@mantine/core"

export default {
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,
    valueSources: [" "],

    default: ({ state, setState }) => <Input state={state} setState={setState} size="xs" w={80} /> ,
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