import { Numbers } from "tabler-icons-react"
import { Box, NumberInput } from "@mantine/core"

export default {
    id: "basic:Number",
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,
    badge: "Math",

    inputs: [],
    outputs: ["$"],

    renderNode: ({ state, setState, alignHandles }) => (

        <Box ref={el => alignHandles("$", el)}>
            <NumberInput
                value={state.$}
                onChange={val => setState({ $: val })}
                placeholder="25"
                radius="md"
                maw={140}
            />
        </Box>
    ),
}
