import { Checkbox } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function CheckboxControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId, false)

    return <Checkbox
        checked={value ?? false}
        onChange={event => setValue(event.currentTarget.checked)}
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
        label="Yes / No"
        radius="sm"
    />
}
