import { SegmentedControl } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function SlideOptionsControl({ inputId, data, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return <SegmentedControl
        value={value ?? ""}
        onChange={setValue}
        data={data}
        {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
    />
}
