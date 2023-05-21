import { Center, NumberInput } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"

export default function NumberControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return (
        <Center>
            <NumberInput
                value={value ?? ""}
                onChange={setValue}
                placeholder="Pick a number..."
                size="xs"
                w="8rem"
                {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
            />
        </Center>
    )
}
