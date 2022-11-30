import { BoxAlignTopLeft } from "tabler-icons-react"
import { TextInput, Text, Group, NumberInput } from "@mantine/core"
import { useEffect } from "react"

export default {
    name: "Range",
    description: "Define a range.",
    icon: BoxAlignTopLeft,
    color: "green.5",
    valueSources: [" "],

    default: ({ state, setState }) => {

        useEffect(() => {
            setState({ $: state.$ ?? "A1:C3" })
        }, [])

        return <Text ff="monospace">{state.$}</Text>
    },

    expanded: ({ state, setState }) => {

        const [, startLetter, startNumber, endLetter, endNumber] = state.$?.match?.(/([A-Za-z]*)([0-9]*):([A-Za-z]*)([0-9]*)/) ?? []

        const setRange = ({ sl = startLetter, sn = startNumber, el = endLetter, en = endNumber }) => {
            setState({ $: `${sl}${sn}:${el}${en}` })
        }

        return (
            <Group spacing="xs" mt={5}>
                <TextInput
                    value={startLetter}
                    onChange={event => setRange({ sl: event.currentTarget.value })}
                    size="xs"
                    w={40}
                    placeholder="A"
                    />
                <NumberInput
                    value={parseInt(startNumber)}
                    onChange={val => setRange({ sn: val })}
                    size="xs"
                    w={60}
                    placeholder="1"
                    />
                <Text>:</Text>
                <TextInput
                    value={endLetter}
                    onChange={event => setRange({ el: event.currentTarget.value })}
                    size="xs"
                    w={40}
                    placeholder="C"
                    />
                <NumberInput
                    value={parseInt(endNumber)}
                    onChange={val => setRange({ en: val })}
                    size="xs"
                    w={60}
                    placeholder="3"
                />
            </Group>
        )
    },
}