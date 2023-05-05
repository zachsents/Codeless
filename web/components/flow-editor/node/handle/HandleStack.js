import { Stack } from "@mantine/core"

export default function HandleStack({ children }) {
    return (
        <Stack
            w={0}
            justify="space-evenly"
            align="center"
            spacing={4}
        >
            {children}
        </Stack>
    )
}
