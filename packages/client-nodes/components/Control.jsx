import { Stack } from "@mantine/core"


export default function Control({ children, ...props }) {
    return (
        <Stack spacing={5} {...props}>
            {children}
        </Stack>
    )
}