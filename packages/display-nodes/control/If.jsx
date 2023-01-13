import { Box, Divider, Flex, Space, Skeleton, Stack, Text } from "@mantine/core"
import { forwardRef, useRef } from "react"
import { ArrowsSplit } from "tabler-icons-react"

export default {
    id: "control:If",
    name: "If / Then / Otherwise",
    description: "Conditionally propagates a signal.",
    icon: ArrowsSplit,

    inputs: ["$condition", "_then", "_otherwise"],
    outputs: ["then", "otherwise"],

    renderNode({ alignHandles }) {

        return <Stack align="center" w={100} spacing={0}>
            <Text>If</Text>
            <SkeletonWithHandle align="left" ref={el => alignHandles("$condition", el)} />
            <Space h="xs" />
            <Text>Then</Text>
            <SkeletonWithHandle align="both" ref={el => alignHandles(["then", "_then"], el)} />
            <Space h="xs" />
            <Text>Otherwise</Text>
            <SkeletonWithHandle align="both" ref={el => alignHandles(["otherwise", "_otherwise"], el)} />
        </Stack>
    },
}

const SkeletonWithHandle = forwardRef(({ align = "left", h = 20, ...props }, ref) => {

    return (
        <Box
            w="100%"
            justify="center"
            align="center"
            sx={{ position: "relative" }}
            ref={ref}
        >
            <Skeleton h={h} animate={false} {...props} />
            <Box
                sx={theme => ({
                    width: align == "both" ? `calc(100% + ${theme.spacing.md * 2}px)` : theme.spacing.md + 10,
                    height: 3,
                    position: "absolute",
                    top: "50%",
                    [align == "right" ? "right" : "left"]: -theme.spacing.md,
                    transform: "translateY(-50%)",
                    background: theme.colors.gray[3],
                })}
            >

            </Box>
        </Box>
    )
})