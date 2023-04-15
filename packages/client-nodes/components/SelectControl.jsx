import { Select } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function SelectControl({ inputId, data, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return <Select
        value={value ?? ""}
        onChange={setValue}
        data={data}
        placeholder="Pick one"
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
