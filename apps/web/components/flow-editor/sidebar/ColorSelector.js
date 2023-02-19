import { Text, Group, ColorSwatch, useMantineTheme, Stack } from "@mantine/core"
import { useAppContext } from "../../../modules/context"
import { useUpdateApp } from "@minus/client-sdk"
import { TbCheck } from "react-icons/tb"
import { AnimatePresence, motion } from "framer-motion"


export default function ColorSelector() {

    return (
        <Stack spacing="xs">
            <Text size="xs" color="dimmed">Background Color</Text>
            <Group grow spacing="xs" h={30}>
                <Swatch color="gray.2" />
                <Swatch color="dark.5" lightCheck />
                <Swatch color="indigo.5" lightCheck />
                <Swatch color="yellow.5" />
            </Group>
        </Stack>
    )
}


function Swatch({ color, lightCheck = false }) {

    const theme = useMantineTheme()

    const { app } = useAppContext()
    const updateApp = useUpdateApp(app?.id)

    const [hue, shade] = color?.split(".") ?? []
    const hexColor = theme.colors[hue][shade]
    const active = hexColor == (app?.theme?.editorBackgroundColor ?? theme.colors.gray[2])

    return (
        <ColorSwatch
            color={hexColor}
            component="button"
            sx={swatchStyle}
            onClick={() => updateApp({ "theme.editorBackgroundColor": hexColor })}
        >
            <AnimatePresence>
                {active &&
                    <motion.div initial={{ scale: 0, marginTop: 3 }} animate={{ scale: 1 }} transition={transition}>
                        <TbCheck color={lightCheck ? theme.colors.gray[1] : theme.colors.dark[7]} />
                    </motion.div>}
            </AnimatePresence>
        </ColorSwatch>
    )
}


const swatchStyle = ({
    cursor: "pointer",
})


const transition = { duration: 0.2, type: "spring" }