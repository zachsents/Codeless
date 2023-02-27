import { Space, Stack, Text } from "@mantine/core"
import { ArrowsSplit } from "tabler-icons-react"
import { SkeletonWithHandle } from "../components/index"

import { useAlignHandles } from "@minus/graph-util"


export default {
    id: "control:If",
    name: "If / Then / Otherwise",
    description: "Conditionally propagates a signal.",
    icon: ArrowsSplit,

    inputs: ["$condition", "_then", "_otherwise"],
    outputs: ["then", "otherwise"],

    renderNode() {

        const alignHandle = useAlignHandles()

        return <Stack align="center" spacing={0}>
            <Text size="xs">If</Text>
            <SkeletonWithHandle align="left" ref={alignHandle("$condition")} />
            <Space h="xs" />
            <Text size="xs">Then</Text>
            <SkeletonWithHandle align="both" ref={alignHandle(["then", "_then"])} />
            <Space h="xs" />
            <Text size="xs">Otherwise</Text>
            <SkeletonWithHandle align="both" ref={alignHandle(["otherwise", "_otherwise"])} />
        </Stack>
    },
}

