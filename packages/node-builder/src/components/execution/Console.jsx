import { ScrollArea, Stack, Text } from '@mantine/core'

export default function Console({ logs }) {

    return (
        <ScrollArea sx={scrollAreaStyle}>
            <Stack spacing="xs">
                {logs.map((log, i) =>
                    <Text size="xs" key={i}>{log}</Text>
                )}
            </Stack>
        </ScrollArea>
    )
}

const scrollAreaStyle = theme => ({
    height: 300,
    pointerEvents: "auto",
    border: "1px solid " + theme.colors.gray[3],
    padding: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 6,
})