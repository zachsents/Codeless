import { Box, Card, useMantineTheme } from "@mantine/core"
import { createLinearGradient } from "../modules/colors"

export default function GradientBox({ children, from = "indigo", to = "cyan", centerAround, shade = 5 }) {

    const theme = useMantineTheme()

    const background = centerAround !== undefined ?
        createLinearGradient(theme.colors, centerAround, { shade }) :
        `linear-gradient(45deg, ${theme.colors[from][shade]} 0%, ${theme.colors[to][shade]} 100%)`

    return (
        <Card p={40} radius="lg" sx={{ background }}>
            {children}
        </Card>
    )
}

