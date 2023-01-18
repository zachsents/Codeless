import { Space, Stack, Text } from "@mantine/core"
import { ChevronRight } from "tabler-icons-react"
import { SkeletonWithHandle } from "../../components"

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

    renderNode({ alignHandles }) {

        return <Stack align="center" w={100} spacing={4}>
            <SkeletonWithHandle align="left" ref={el => alignHandles("_a", el)} />
            <Text size="xs">is greater than</Text>
            <SkeletonWithHandle align="left" ref={el => alignHandles("_b", el)} />
        </Stack>
    },
}