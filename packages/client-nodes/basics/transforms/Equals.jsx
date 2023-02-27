import { Stack, Text } from "@mantine/core"
import { Equal } from "tabler-icons-react"
import { SkeletonWithHandle } from "../../components/index"

import { useAlignHandles } from "@minus/graph-util"


export default {
    id: "basic:Equals",
    name: "Equals",
    description: "Tests if things are equal.",
    icon: Equal,

    inputs: ["_a", "_b"],
    outputs: [
        {
            name: "$",
            label: "True / False"
        }
    ],

    renderNode() {

        const alignHandle = useAlignHandles()

        return <Stack align="center" spacing={4} ref={alignHandle("$")}>
            <SkeletonWithHandle align="left" ref={alignHandle("_a")} />
            <Text size="xs">equals</Text>
            <SkeletonWithHandle align="left" ref={alignHandle("_b")} />
        </Stack>
    },
}