import { Slider } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function SliderControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    const marks = inputProps.min != null && inputProps.max != null ? [
        { value: inputProps.min, label: inputProps.min },
        { value: inputProps.max, label: inputProps.max },
    ] : undefined

    return <Slider
        value={value ?? 0}
        onChange={setValue}
        px="xs"
        mb={4}
        marks={marks}
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
