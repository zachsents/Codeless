import { DateTimePicker } from "@mantine/dates"
import { useNodeInputValue } from "../hooks"

export default function DateTimeControl({ nodeId, inputId, inputProps = {} }) {

    const [value, setValue] = useNodeInputValue(nodeId, inputId, new Date())
    console.log("date value", value)

    return (
        <DateTimePicker
            value={value}
            onChange={setValue}
            clearable
            {...inputProps}
        />
    )
}
