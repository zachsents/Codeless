import { BoxAlignTop } from "tabler-icons-react"
import { TextInput, Text, NumberInput, Stack } from "@mantine/core"

export default {
    name: "Row",
    description: "A range selecting a row.",
    icon: BoxAlignTop,
    color: "green.5",
    valueSources: [" "],

    defaultState: { $: "A1:1" },

    default: ({ state }) => <Text ff="monospace">{state.$}</Text>,

    expanded: ({ state, setState }) => {

        const [, letter, number] = state.$?.match?.(/([A-Za-z]*)([0-9]*):/) ?? []

        const setRange = ({ le = letter, num = number }) => {
            setState({ $: `${le}${num}:${num}` })
        }

        return (
            <Stack w={80}>
                <NumberInput
                    label="Row"
                    value={parseInt(number) ?? null}
                    onChange={val => setRange({ num: val })}
                    size="xs"
                    placeholder="1"
                />
                <TextInput
                    label="Starting Column"
                    value={letter ?? ""}
                    onChange={event => setRange({ le: event.currentTarget.value })}
                    size="xs"
                    placeholder="A"
                />
            </Stack>
        )
    },
}