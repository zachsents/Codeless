import { Numbers } from "tabler-icons-react"
import { Box, NumberInput } from "@mantine/core"

import { useAlignHandles, useNodeState } from "@minus/graph-util"


export default {
    id: "basic:Number",
    name: "Number",
    description: "Just a plain ol' number.",
    icon: Numbers,
    badge: "Math",

    inputs: [],
    outputs: ["$"],

    defaultState: {
        $: null
    },

    renderNode: () => {

        const [state, setState] = useNodeState()
        const alignHandle = useAlignHandles()

        return <Box ref={alignHandle("$")}>
            <NumberInput
                value={state.$}
                onChange={val => setState({ $: val })}
                placeholder="25"
                radius="md"
                maw={140}
            />
        </Box>
    },
}
