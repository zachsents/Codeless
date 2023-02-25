import { Space, Stack, Text } from "@mantine/core"
import { ArrowsSplit } from "tabler-icons-react"
import { SkeletonWithHandle } from "../components/index"


export default {
    id: "control:If",
    name: "If / Then / Otherwise",
    description: "Conditionally propagates a signal.",
    icon: ArrowsSplit,

    inputs: ["$condition", "_then", "_otherwise"],
    outputs: ["then", "otherwise"],

    renderNode({ alignHandles }) {

        return <Stack align="center" spacing={0}>
            <Text size="xs">If</Text>
            <SkeletonWithHandle align="left" ref={el => alignHandles("$condition", el)} />
            <Space h="xs" />
            <Text size="xs">Then</Text>
            <SkeletonWithHandle align="both" ref={el => alignHandles(["then", "_then"], el)} />
            <Space h="xs" />
            <Text size="xs">Otherwise</Text>
            <SkeletonWithHandle align="both" ref={el => alignHandles(["otherwise", "_otherwise"], el)} />
        </Stack>
    },
}

