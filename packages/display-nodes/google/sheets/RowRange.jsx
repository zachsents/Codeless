import { SortAscendingLetters } from "tabler-icons-react"
import { TextInput, Group, NumberInput, Stack } from "@mantine/core"

export default {
    name: "Row Range",
    description: "A range selecting a row.",
    icon: SortAscendingLetters,
    color: "green",
    valueSources: [" "],

    defaultState: { $: "A1:1" },

    renderName: ({ state }) => state.$,

    configuration: ({ state, setState }) => {

        const [, letter, number] = state.$?.match?.(/([A-Za-z]*)([0-9]*):/) ?? []

        const setRange = ({ le = letter, num = number }) => {
            setState({ $: `${le}${num}:${num}` })
        }

        return (
            <Group w={240} grow>
                <NumberInput
                    label="Row"
                    value={parseInt(number) ?? null}
                    onChange={val => setRange({ num: val })}
                    placeholder="1"
                />
                <TextInput
                    label="Starting Column"
                    value={letter ?? ""}
                    onChange={event => setRange({ le: event.currentTarget.value })}
                    placeholder="A"
                />
            </Group>
        )
    },
}