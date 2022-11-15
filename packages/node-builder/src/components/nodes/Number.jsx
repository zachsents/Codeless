import { NumberInput } from "@mantine/core"
import { setNodeState, useNodeState } from "../../util"

export function Number(props) {

    const [value, setValue] = useNodeState(props.id, { $: 0 })

    return (
        <NumberInput value={value.$ ?? 0} onChange={val => setValue({ $: val })} styles={numberInputStyle} />
    )
}

const numberInputStyle = theme => ({
    root: {
        margin: "-5px -40px -5px -40px",
        width: 100,
    },
    input: {
        textAlign: "center",
    }
})