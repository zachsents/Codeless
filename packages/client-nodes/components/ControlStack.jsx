import { Stack } from "@mantine/core"


export default function ControlStack({
    children,
    ...props
}) {
    return (
        <Stack {...props}>
            {children}
        </Stack>
    )
}