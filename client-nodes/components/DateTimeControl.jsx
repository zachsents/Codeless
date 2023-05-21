import { useMantineTheme } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useInputValue } from "../hooks/nodes"



export default function DateTimeControl({ inputId, inputProps = {} }) {

    const theme = useMantineTheme()

    const [value, setValue] = useInputValue(null, inputId, new Date().toISOString())

    return (
        <DateTimePicker
            value={value ? new Date(value) : null}
            onChange={newValue => setValue(newValue?.toISOString() ?? null)}
            clearable
            valueFormat={theme.other.dateTimeFormat}
            size="xs"
            {...inputProps}
            popoverProps={{ withinPortal: true, shadow: "sm" }}
        />
    )
}
