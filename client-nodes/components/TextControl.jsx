import { TextInput } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function TextControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return <TextInput
        value={value ?? ""}
        onChange={event => setValue(event.currentTarget.value)}
        placeholder="Type something..."
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
