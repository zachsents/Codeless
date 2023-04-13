import { Box, NumberInput } from "@mantine/core"
import { Numbers } from "tabler-icons-react"
import { useInternalState } from "../hooks/nodes"

export default {
    id: "basic:Number",
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,

    tags: ["Math", "Basics"],
    showMainTag: false,

    inputs: [],
    outputs: [
        {
            id: "$",
            name: "Number",
            description: "The number.",
            tooltip: "The number.",
            icon: Numbers,
        }
    ],

    renderCard: false,
    renderName: false,

    renderContent: () => {
        const [state, setState] = useInternalState()
        return <Box mr={2}>
            <NumberInput
                value={state.$}
                onChange={val => setState({ $: val })}
                placeholder="Pick a number..."
                size="lg"
                w={220}
                controls
            />
        </Box>
    },
}
