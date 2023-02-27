import { TextInput, Text, Grid, NumberInput, Center } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"

import { useNodeState } from "@minus/graph-util"


export default {
    id: "googlesheets:Range",
    name: "Get Range",
    description: "Gets a range of values from a Google Sheet.",
    icon: SiGooglesheets,
    color: "green",
    badge: "Google Sheets",

    inputs: ["$sheet"],
    outputs: ["data"],

    requiredIntegrations: ["integration:GoogleSheets"],

    defaultState: { range: ["", "", "", ""] },

    renderNode: () => {

        const [state] = useNodeState()

        const [startRow, startColumn, endRow, endColumn] = state.range ?? ["", "", "", ""]

        const rangeString = "" + startColumn + startRow + (endColumn ? ":" : "") + endColumn + endRow

        return (
            <Center>
                {rangeString ?
                    <Text>{rangeString}</Text>
                    :
                    <Text size="xs" color="dimmed">Empty Range</Text>}
            </Center>
        )
    },

    configuration: () => {

        const [state, setState] = useNodeState()

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