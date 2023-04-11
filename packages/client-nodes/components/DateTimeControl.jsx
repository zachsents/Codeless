import { DateTimePicker } from "@mantine/dates"
import { useNodeInputValue } from "../hooks"

export default function DateTimeControl({ nodeId, inputId, inputProps = {} }) {

    const [value, setValue] = useNodeInputValue(nodeId, inputId, new Date().toISOString())

    return (
        <DateTimePicker
            value={new Date(value)}
            onChange={newValue => setValue(newValue.toISOString())}
            clearable
            valueFormat="MMM D, YYYY h:mm A"
            {...inputProps}
        />
    )
}
