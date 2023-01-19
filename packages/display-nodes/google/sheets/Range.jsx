import { TextInput, Text, Grid, NumberInput } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"


export default {
    id: "googlesheets:Range",
    name: "Range",
    description: "Gets a range of values from a Google Sheet.",
    icon: SiGooglesheets,
    color: "green",

    inputs: ["$sheet"],
    outputs: ["data"],

    defaultState: { range: ["", "", "", ""] },

    renderNode: ({ state, containerComponent: ContainerComponent }) => {

        const [startRow, startColumn, endRow, endColumn] = state.range ?? ["", "", "", ""]

        const rangeString = "" + startColumn + startRow + (endColumn ? ":" : "") + endColumn + endRow

        return <ContainerComponent>
            <Text size="xs" lh={1.2}>{rangeString || "Empty Range"}</Text>
        </ContainerComponent>
    },

    configuration: ({ state, setState }) => {

        const [startRow, startColumn, endRow, endColumn] = state.range ?? ["", "", "", ""]

        const setRange = ({ sr = startRow, sc = startColumn, er = endRow, ec = endColumn }) => {
            setState({ range: [sr, sc, er, ec] })
        }

        return (
            <Grid w={280} gutter="xs" columns={13}>
                <Grid.Col span={3}>
                    <TextInput
                        radius="md"
                        value={startColumn ?? ""}
                        onChange={event => setRange({ sc: event.currentTarget.value })}
                        placeholder="A"
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <NumberInput
                        radius="md"
                        hideControls
                        value={startRow ?? null}
                        onChange={val => setRange({ sr: val })}
                        placeholder="1"
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <Text>:</Text>
                </Grid.Col>
                <Grid.Col span={3}>
                    <TextInput
                        radius="md"
                        value={endColumn ?? ""}
                        onChange={event => setRange({ ec: event.currentTarget.value })}
                        placeholder="C"
                    />
                </Grid.Col>
                <Grid.Col span={3}>
                    <NumberInput
                        radius="md"
                        hideControls
                        value={endRow ?? null}
                        onChange={val => setRange({ er: val })}
                        placeholder="3"
                    />
                </Grid.Col>
            </Grid>
        )
    },
}