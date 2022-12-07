import { BoxAlignLeft } from "tabler-icons-react"
import { TextInput, Group, NumberInput, Stack } from "@mantine/core"

export default {
    name: "Column",
    description: "A range selecting a column.",
    icon: BoxAlignLeft,
    color: "green.5",
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