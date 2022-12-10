import { SortAscendingLetters } from "tabler-icons-react"
import { TextInput, NumberInput, Grid, Text } from "@mantine/core"
import { parseRange } from "./util"

export default {
    name: "Cell Range",
    description: "A range selectin a single cell.",
    icon: SortAscendingLetters,
    color: "green",
    valueSources: [" "],

    defaultState: { $: "A1" },

    renderNode: ({ state, containerComponent: ContainerComponent }) => {

        const { sheet, start } = parseRange(state.$)

        return <ContainerComponent>
            <Text size={8} lh={1.2}>{sheet}</Text>    
            <Text size="xs" lh={1.2}>{start}</Text>    
        </ContainerComponent>
    },

    configuration: ({ state, setState }) => {

        const { sheet, start } = parseRange(state.$)
        const [, letter, number] = start?.match?.(/([A-Za-z]*)([0-9]*)/) ?? []

        const setRange = ({ letter: newLetter = letter, number: newNumber = number, sheet: newSheet = sheet }) => {
            setState({ $: `${newSheet ? `'${newSheet}'!` : ""}${newLetter}${newNumber}` })
        }

        return (
            <Grid w={160} gutter="xs">
                <Grid.Col span={12}>
                    <TextInput
                        value={sheet ?? ""}
                        onChange={event => setRange({ sheet: event.currentTarget.value })}
                        placeholder="Sheet Name"
                    />
                </Grid.Col>
                <Grid.Col span="auto">
                    <TextInput
                        value={letter ?? ""}
                        onChange={event => setRange({ letter: event.currentTarget.value })}
                        placeholder="A"
                    />
                </Grid.Col>
                <Grid.Col span="auto">
                    <NumberInput
                        value={parseInt(number) ?? null}
                        onChange={val => setRange({ number: val })}
                        placeholder="1"
                    />
                </Grid.Col>
            </Grid>
        )
    },
}