import { SortAscendingLetters } from "tabler-icons-react"
import { TextInput, Group, NumberInput } from "@mantine/core"

export default {
    name: "Column Range",
    description: "A range selecting a column.",
    icon: SortAscendingLetters,
    color: "green",
    valueSources: [" "],

    defaultState: { $: "A1:A" },

    renderName: ({ state }) => state.$,

    configuration: ({ state, setState }) => {

        const [, letter, number] = state.$?.match?.(/([A-Za-z]*)([0-9]*):/) ?? []

        const setRange = ({ le = letter, num = number }) => {
            setState({ $: `${le}${num}:${le}` })
        }

        return (
            <Group w={240} grow>
                <TextInput
                    label="Column"
                    value={letter ?? ""}
                    onChange={event => setRange({ le: event.currentTarget.value })}
                    placeholder="A"
                />
                <NumberInput
                    label="Starting Row"
                    value={parseInt(number) ?? null}
                    onChange={val => setRange({ num: val })}
                    placeholder="1"
                />
            </Group>
        )
    },
}