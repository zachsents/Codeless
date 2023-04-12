import { DateTimePicker } from "@mantine/dates"
import { useInputValue } from "../hooks/nodes"

export default function DateTimeControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId, new Date().toISOString())

    return (
        <DateTimePicker
            value={value ? new Date(value) : null}
            onChange={newValue => setValue(newValue?.toISOString() ?? null)}
            clearable
            valueFormat="MMM D, YYYY h:mm A"
            {...inputProps}
        />
    )
}
