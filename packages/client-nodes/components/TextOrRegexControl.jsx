import { Button, Group, Stack } from "@mantine/core"
import { useInputValue, useInternalState } from "../hooks/nodes"
import RegexControl from "./RegexControl"
import TextControl from "./TextControl"

export default function TextOrRegexControl({ inputId, ...props }) {

    const [state, setState] = useInternalState()
    const [, setValue] = useInputValue(null, inputId)

    const modeKey = `${inputId}UsingRegex`

    const toggle = () => {
        setState({ [modeKey]: !state[modeKey] })
        setValue(undefined)
    }

    return <Stack>
        {state[modeKey] ?
            <RegexControl inputId={inputId} {...props} /> :
            <TextControl inputId={inputId} {...props} />}
        <Group position="right">
            <Button compact size="xs" variant="subtle" onClick={toggle}>
                {state[modeKey] ? "Use Simple Text" : "Use Regex"}
            </Button>
        </Group>
    </Stack>
}
