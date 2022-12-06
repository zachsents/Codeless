import { BoxAlignTopLeft } from "tabler-icons-react"
import { TextInput, Text, Group, NumberInput } from "@mantine/core"

export default {
    name: "Range",
    description: "Define a range.",
    icon: BoxAlignTopLeft,
    color: "green.5",
    valueSources: [" "],

    defaultState: { $: "A1:C4" },

    default: ({ state }) => <Text ff="monospace">{state.$}</Text>,

    expanded: ({ state, setState }) => {

        const [, start, end] = state.$?.match?.(/([A-Za-z0-9]*):([A-Za-z0-9]*)/) ?? []

        const setRange = ({ s = start, e = end }) => {
            setState({ $: `${s}:${e}` })
        }

        return (
            <Group spacing="xs" mt={5}>
                <TextInput
                    value={start ?? ""}
                    onChange={event => setRange({ s: event.currentTarget.value })}
                    size="xs"
                    w={60}
                    placeholder="A1"
                />
                <Text>:</Text>
                <TextInput
                    value={end ?? ""}
                    onChange={event => setRange({ e: event.currentTarget.value })}
                    size="xs"
                    w={60}
                    placeholder="C4"
                />
            </Group>
        )
    },
}