import { Stack, Text } from "@mantine/core"
import { Equal } from "tabler-icons-react"
import { SkeletonWithHandle } from "../../components"

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

    renderNode({ alignHandles }) {

        return <Stack align="center" spacing={4} ref={el => alignHandles("$", el)}>
            <SkeletonWithHandle align="left" ref={el => alignHandles("_a", el)} />
            <Text size="xs">equals</Text>
            <SkeletonWithHandle align="left" ref={el => alignHandles("_b", el)} />
        </Stack>
    },
}