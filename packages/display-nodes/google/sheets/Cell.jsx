import { BoxPadding } from "tabler-icons-react"
import { TextInput, Text, Group, NumberInput } from "@mantine/core"

export default {
    name: "Cell",
    description: "A range selectin a single cell.",
    icon: BoxPadding,
    color: "green.5",
    valueSources: [" "],

    defaultState: { $: "A1" },

    default: ({ state }) => <Text ff="monospace">{state.$}</Text>,

    expanded: ({ state, setState }) => {

        const [, letter, number] = state.$?.match?.(/([A-Za-z]*)([0-9]*)/) ?? []

        const setRange = ({ le = letter, num = number }) => {
            setState({ $: `${le}${num}` })
        }

        return (
            <Group spacing="xs" mt={5}>
                <TextInput
                    value={letter ?? ""}
                    onChange={event => setRange({ le: event.currentTarget.value })}
                    size="xs"
                    w={40}
                    placeholder="A"
                    />
                <NumberInput
                    value={parseInt(number) ?? null}
                    onChange={val => setRange({ num: val })}
                    size="xs"
                    w={60}
                    placeholder="1"
                    />
            </Group>
        )
    },
}