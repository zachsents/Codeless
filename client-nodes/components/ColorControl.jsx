import { ColorPicker, useMantineTheme } from "@mantine/core"
import { useEffect } from "react"
import { useInputValue } from "../hooks/nodes"


const COLORS = ["red", "orange", "yellow", "green", "blue", "violet", "pink"]
const LIGHT_SHADE = 3
const DARK_SHADE = 5

export default function ColorControl({ inputId, dark = false, inputProps = {} }) {

    const theme = useMantineTheme()

    const lightSwatches = COLORS.map(color => theme.colors[color][LIGHT_SHADE])
    const darkSwatches = COLORS.map(color => theme.colors[color][DARK_SHADE])

    const [value, setValue] = useInputValue(null, inputId)

    // Side-effect: When dark mode changes, find the equivalent color in the new mode.
    useEffect(() => {
        const lightIndex = lightSwatches.indexOf(value)
        const darkIndex = darkSwatches.indexOf(value)
        const currentIndex = lightIndex != -1 ? lightIndex : darkIndex
        setValue(dark ? darkSwatches[currentIndex] : lightSwatches[currentIndex])
    }, [dark])

    return <ColorPicker
        format="hex"
        swatches={dark ? darkSwatches : lightSwatches}
        value={value ?? null}
        onChange={setValue}
        withPicker={false}
        fullWidth
        size="sm"
        classNames={{
            swatch: "scale-[0.6] transition-transform",
            swatches: "justify-center",
        }}
        styles={{
            swatch: {
                [`&[aria-label="${value}"]`]: {
                    transform: "scale(1)",
                }
            }
        }}
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
