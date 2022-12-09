import { BoxAlignTopLeft } from "tabler-icons-react"
import { TextInput, Text, Group, Stack, Grid } from "@mantine/core"
import { parseRange } from "./util"

export default {
    name: "Range",
    description: "Define a range.",
    icon: BoxAlignTopLeft,
    color: "green.5",
    valueSources: [" "],

    defaultState: { $: "A1:C4" },

    renderNode: ({ state, containerComponent: ContainerComponent }) => {

        const { sheet, start, end } = parseRange(state.$)

        return <ContainerComponent>
            <Text size={8} lh={1.2}>{sheet}</Text>    
            <Text size="xs" lh={1.2}>{start}:{end}</Text>    
        </ContainerComponent>
    },

    configuration: ({ state, setState }) => {

        const { sheet, start, end } = parseRange(state.$)

        const setRange = ({ start: newStart = start, end: newEnd = end, sheet: newSheet = sheet }) => {
            setState({ $: `${newSheet ? `'${newSheet}'!` : ""}${newStart}:${newEnd}` })
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
                        value={start ?? ""}
                        onChange={event => setRange({ start: event.currentTarget.value })}
                        placeholder="A1"
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <Text>:</Text>
                </Grid.Col>
                <Grid.Col span="auto">
                    <TextInput
                        value={end ?? ""}
                        onChange={event => setRange({ end: event.currentTarget.value })}
                        placeholder="C4"
                    />
                </Grid.Col>
            </Grid>
        )
    },
}