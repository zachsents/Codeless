import { forwardRef } from "react"
import { Box, Group, Skeleton, Stack, Text, Tooltip } from "@mantine/core"
import { InfoCircle } from "tabler-icons-react"


export function ControlStack({ children, w = 180, ...props }) {
    return (
        <Stack w={w} {...props}>
            {children}
        </Stack>
    )
}

export function ControlLabel({ children, bold = false, info }) {
    return (
        <Group position="apart">
            <Text size="sm" weight={bold ? 500 : 400}>{children}</Text>
            {info &&
                <Tooltip label={info}>
                    <Text color="dimmed" size="sm" mb={-5}><InfoCircle size={15} /></Text>
                </Tooltip>}
        </Group>
    )
}

export function Control({ children, ...props }) {
    return (
        <Stack spacing={5} {...props}>
            {children}
        </Stack>
    )
}

export const SkeletonWithHandle = forwardRef(({ align = "left", h = 15, ...props }, ref) => {

    return (
        <Box
            w="100%"
            justify="center"
            align="center"
            sx={{ position: "relative" }}
            ref={ref}
        >
            <Box
                sx={theme => ({
                    width: "100%",
                    height: h,
                    backgroundColor: theme.colors.gray[2],
                    borderRadius: h / 2,
                })}
            ></Box>
            <Box
                sx={theme => ({
                    width: align == "both" ? `calc(100% + ${theme.spacing.md * 2}px)` : theme.spacing.md + 10,
                    height: 3,
                    position: "absolute",
                    top: "50%",
                    [align == "right" ? "right" : "left"]: -theme.spacing.md,
                    transform: "translateY(-50%)",
                    background: theme.colors.gray[2],
                })}
            ></Box>
        </Box>
    )
})