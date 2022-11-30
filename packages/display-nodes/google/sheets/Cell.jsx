import { BoxPadding } from "tabler-icons-react"
import { TextInput, Text, Group, NumberInput } from "@mantine/core"
import { useEffect } from "react"

export default {
    name: "Cell",
    description: "Define a single cell.",
    icon: BoxPadding,
    color: "green.5",
    valueSources: [" "],

    default: ({ state, setState }) => {

        useEffect(() => {
            setState({ $: state.$ ?? "A1" })
        }, [])

        return <Text ff="monospace">{state.$}</Text>
    },

    expanded: ({ state, setState }) => {

        const [, letter, number] = state.$?.match?.(/([A-Za-z]*)([0-9]*)/) ?? []

        const setRange = ({ le = letter, num = number }) => {
            setState({ $: `${le}${num}` })
        }

        return (
            <Group spacing="xs" mt={5}>
                <TextInput
                    value={letter}
                    onChange={event => setRange({ le: event.currentTarget.value })}
                    size="xs"
                    w={40}
                    placeholder="A"
                    />
                <NumberInput
                    value={parseInt(number)}
                    onChange={val => setRange({ num: val })}
                    size="xs"
                    w={60}
                    placeholder="1"
                    />
            </Group>
        )
    },
}