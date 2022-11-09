import { Box, Card, useMantineTheme } from "@mantine/core"

export default function GradientBox({ children, from = "indigo", to = "cyan", centerAround, shade = 5 }) {

    const theme = useMantineTheme()
    const colorKeys = Object.keys(theme.colors)
    const centerIndex = centerAround && colorKeys.findIndex(key => key == centerAround)

    const background = centerAround ?
        `linear-gradient(45deg, ${theme.colors[colorKeys[centerIndex - 1]][shade]} 0%, ${theme.colors[colorKeys[centerIndex + 1]][shade]} 100%)` :
        `linear-gradient(45deg, ${theme.colors[from][shade]} 0%, ${theme.colors[to][shade]} 100%)`

    return (
        <Card p={40} mb={30} radius="lg" sx={{ background }}>
            {children}
        </Card>
    )
}

