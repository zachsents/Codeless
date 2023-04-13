import { NumberInput } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function NumberControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return <NumberInput
        value={value ?? ""}
        onChange={setValue}
        placeholder="Pick a number..."
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
