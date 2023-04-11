import { TextInput } from "@mantine/core"
import { useNodeInputValue } from "../hooks"

export default function TextControl({ nodeId, inputId, inputProps = {} }) {

    const [value, setValue] = useNodeInputValue(nodeId, inputId)

    return <TextInput
        value={value ?? ""}
        onChange={event => setValue(event.currentTarget.value)}
        {...inputProps}
    />
}
