import { Stack, Text } from "@mantine/core"
import { ChevronRight } from "tabler-icons-react"
import { SkeletonWithHandle } from "../../components/index"

import { useAlignHandles } from "@minus/graph-util"


export default {
    id: "basic:GreaterThan",
    name: "Greater Than",
    description: "Compares two numbers.",
    icon: ChevronRight,

    inputs: ["_a", "_b"],
    outputs: [
        {
            name: "$",
            label: "True / False"
        }
    ],

    renderNode() {

        const alignHandle = useAlignHandles()

        return <Stack align="center" w={100} spacing={4} ref={alignHandle("$")}>
            <SkeletonWithHandle align="left" ref={alignHandle("_a")} />
            <Text size="xs">is greater than</Text>
            <SkeletonWithHandle align="left" ref={alignHandle("_b")} />
        </Stack>
    },
}