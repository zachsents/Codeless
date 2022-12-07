import { BoxPadding } from "tabler-icons-react"
import { TextInput, Text, Group, NumberInput } from "@mantine/core"

export default {
    name: "Cell",
    description: "A range selectin a single cell.",
    icon: BoxPadding,
    color: "green.5",
    valueSources: [" "],

    defaultState: { $: "A1" },

    renderName: ({ state }) => state.$,

    configuration: ({ state, setState }) => {

        const [, letter, number] = state.$?.match?.(/([A-Za-z]*)([0-9]*)/) ?? []

        const setRange = ({ le = letter, num = number }) => {
            setState({ $: `${le}${num}` })
        }

        return (
            <Group spacing="xs">
                <TextInput
                    value={letter ?? ""}
                    onChange={event => setRange({ le: event.currentTarget.value })}
                    w={60}
                    placeholder="A"
                />
                <NumberInput
                    value={parseInt(number) ?? null}
                    onChange={val => setRange({ num: val })}
                    // size="xs"
                    w={80}
                    placeholder="1"
                />
            </Group>
        )
    },
}