import { Box, Space, Stack, Text } from "@mantine/core"
import { ArrowsJoin } from "tabler-icons-react"
import { SkeletonWithHandle } from "../components"


export default {
    id: "basic:Ternary",
    name: "Ternary",
    description: "Chooses between two values.",
    icon: ArrowsJoin,

    inputs: ["condition", "ifTrue", "ifFalse"],
    outputs: ["output"],


    renderNode: ({ alignHandles }) => {
        return (
            <Stack align="center" spacing={0}>
                <Text size="xs">If</Text>
                <SkeletonWithHandle align="left" ref={el => alignHandles("condition", el)} />
                <Space h="xs" />
                <Text size="xs">Then</Text>
                <Box ref={el => alignHandles("output", el)}>
                    <SkeletonWithHandle align="both" ref={el => alignHandles("ifTrue", el)} />
                    <Space h="xs" />
                    <Text size="xs">Otherwise</Text>
                    <SkeletonWithHandle align="both" ref={el => alignHandles("ifFalse", el)} />
                </Box>
            </Stack>
        )
    },


}