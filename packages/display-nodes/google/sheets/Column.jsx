import { BoxAlignLeft } from "tabler-icons-react"
import { TextInput, Text, NumberInput, Stack } from "@mantine/core"

export default {
    name: "Column",
    description: "A range selecting a column.",
    icon: BoxAlignLeft,
    color: "green.5",
    valueSources: [" "],

    defaultState: { $: "A1:A" },

    default: ({ state }) => <Text ff="monospace">{state.$}</Text>,

    expanded: ({ state, setState }) => {

        const [, letter, number] = state.$?.match?.(/([A-Za-z]*)([0-9]*):/) ?? []

        const setRange = ({ le = letter, num = number }) => {
            setState({ $: `${le}${num}:${le}` })
        }

        return (
            <Stack w={80}>
                <TextInput
                    label="Column"
                    value={letter ?? ""}
                    onChange={event => setRange({ le: event.currentTarget.value })}
                    size="xs"
                    placeholder="A"
                />
                <NumberInput
                    label="Starting Row"
                    value={parseInt(number) ?? null}
                    onChange={val => setRange({ num: val })}
                    size="xs"
                    placeholder="1"
                />
            </Stack>
        )
    },
}