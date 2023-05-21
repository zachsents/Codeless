import { Textarea } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function TextAreaControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return <Textarea
        value={value ?? ""}
        onChange={event => setValue(event.currentTarget.value)}
        placeholder="Type something..."
        autosize
        minRows={1}
        maxRows={15}
        size="xxs"
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
