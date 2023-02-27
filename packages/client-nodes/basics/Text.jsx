import { Box, Textarea } from "@mantine/core"
import { AlphabetLatin } from "tabler-icons-react"

import { useAlignHandles, useNodeState } from "@minus/graph-util"


export default {
    id: "basic:Text",
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,
    badge: "Text",

    inputs: [],
    outputs: ["$"],

    defaultState: {
        $: "",
    },

    renderNode: () => {

        const [state, setState] = useNodeState()
        const alignHandle = useAlignHandles()

        return <Box ref={alignHandle("$")}>
            <Textarea
                value={state.$ ?? ""}
                onChange={event => setState({ $: event.currentTarget.value })}
                placeholder="Type something..."
                size="xs"
                autosize
                minRows={1}
                maxRows={15}
            />
        </Box>
    },
}
