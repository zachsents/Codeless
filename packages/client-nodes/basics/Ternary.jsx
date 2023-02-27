import { Center, Group, Stack } from "@mantine/core"
import { ArrowsJoin, SquareArrowRight, SquareCheck, SquareX } from "tabler-icons-react"

import { useAlignHandles } from "@minus/graph-util"


export default {
    id: "basic:Ternary",
    name: "Choose Between Values",
    description: "Chooses between two values.",
    icon: ArrowsJoin,

    inputs: ["condition", "ifTrue", "ifFalse"],
    outputs: ["output"],

    renderName: () => "Choose",

    renderNode: () => {

        const alignHandle = useAlignHandles()
        alignHandle("condition")()

        return (
            <Group>
                <Stack spacing="xs">
                    <Center ref={alignHandle("ifTrue")} >
                        <SquareCheck />
                    </Center>
                    <Center ref={alignHandle("ifFalse")}>
                        <SquareX />
                    </Center>
                </Stack>
                <Center ref={alignHandle("output")}>
                    <SquareArrowRight />
                </Center>
            </Group>
        )
    },
}