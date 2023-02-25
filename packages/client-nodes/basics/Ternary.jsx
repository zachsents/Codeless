import { Box, Center, Group, Space, Stack, Text } from "@mantine/core"
import { TbSquareCheck } from "react-icons/tb"
import { ArrowsJoin, SquareArrowRight, SquareCheck, SquareX } from "tabler-icons-react"
import { SkeletonWithHandle } from "../components/index"


export default {
    id: "basic:Ternary",
    name: "Choose Between Values",
    description: "Chooses between two values.",
    icon: ArrowsJoin,

    inputs: ["condition", "ifTrue", "ifFalse"],
    outputs: ["output"],

    renderName: () => "Choose",

    renderNode: ({ alignHandles }) => {

        alignHandles("condition")

        return (
            <Group>
                <Stack spacing="xs">
                    <Center ref={el => alignHandles("ifTrue", el)} >
                        <SquareCheck />
                    </Center>
                    <Center ref={el => alignHandles("ifFalse", el)}>
                        <SquareX />
                    </Center>
                </Stack>
                <Center ref={el => alignHandles("output", el)}>
                    <SquareArrowRight />
                </Center>
            </Group>
            // <Stack align="center" spacing={0}>
            //     <Text size="xs">If</Text>
            //     <SkeletonWithHandle align="left" ref={el => alignHandles("condition", el)} />
            //     <Space h="xs" />
            //     <Text size="xs">Then</Text>
            //     <Box ref={el => alignHandles("output", el)}>
            //         <SkeletonWithHandle align="left" ref={el => alignHandles("ifTrue", el)} />
            //         <Space h="xs" />
            //         <Text size="xs">Otherwise</Text>
            //         <SkeletonWithHandle align="left" ref={el => alignHandles("ifFalse", el)} />
            //     </Box>
            // </Stack>
        )
    },


}