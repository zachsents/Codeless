import { Slider } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function SliderControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return <Slider
        value={value ?? 0}
        onChange={setValue}
        px="xs"
        mb={4}
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
