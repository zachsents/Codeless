import { TextInput } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function InferControl({ inputId, inputProps = {} }) {

    const [value, _setValue] = useInputValue(null, inputId)

    const setValue = newValue => {
        const asFloat = parseFloat(newValue)
        if (!isNaN(asFloat))
            return _setValue(asFloat)

        if (newValue.toLowerCase() === "true")
            return _setValue(true)

        if (newValue.toLowerCase() === "false")
            return _setValue(false)

        _setValue(newValue)
    }

    return <TextInput
        value={value == null ? "" : `${value}`}
        onChange={event => setValue(event.currentTarget.value)}
        placeholder="Type something..."
        size="xs"
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
