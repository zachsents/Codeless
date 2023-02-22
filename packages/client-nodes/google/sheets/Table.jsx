import { TextInput, Text, Grid, NumberInput, Checkbox, Group, Button } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { Control, ControlLabel, ControlStack } from "../../components"


export default {
    id: "googlesheets:Table",
    name: "Use Sheet as Table",
    description: "Uses a Google Sheet as if it were a table.",
    icon: SiGooglesheets,
    color: "green",
    badge: "Google Sheets",

    inputs: ["$sheet"],
    outputs: [
        {
            name: "table",
            suggested: [
                { node: "tables:AddRow", handle: "$table" },
                { node: "tables:FindRowsByField", handle: "$table" },
            ],
        }
    ],

    requiredIntegrations: ["integration:GoogleSheets"],

    defaultState: {
        useEntireSheet: true,
        range: ["", "", "", ""],
        headerRow: 1,
        startRow: 2,
    },

    renderNode: ({ state, containerComponent: ContainerComponent }) => {

        const [startRow, startColumn, endRow, endColumn] = state.range ?? ["", "", "", ""]

        const rangeString = "" + startColumn + startRow + (endColumn ? ":" : "") + endColumn + endRow

        return (
            <Text color="dimmed" size="xs" align="center">
                Use {state.useEntireSheet ? "entire sheet" : (rangeString || "<Empty Range>")} as table
            </Text>
        )
    },

    configuration: ({ state, setState }) => {

        const [startRow, startColumn, endRow, endColumn] = state.range ?? ["", "", "", ""]

        const setRange = ({ sr = startRow, sc = startColumn, er = endRow, ec = endColumn }) => {
            setState({ range: [sr, sc, er, ec] })
        }

        return (
            <ControlStack>
                <Control>
                    <Checkbox
                        label="Use Entire Sheet"
                        checked={state.useEntireSheet}
                        onChange={event => setState({ useEntireSheet: event.currentTarget.checked })}
                    />
                </Control>

                <Control>
                    <ControlLabel info="The range of the table you want to select.">
                        Table Range
                    </ControlLabel>

                    <Grid w="100%" gutter="xs" columns={13}>
                        <Grid.Col span={3}>
                            <TextInput
                                radius="md"
                                value={startColumn ?? ""}
                                onChange={event => setRange({ sc: event.currentTarget.value })}
                                placeholder="A"
                                disabled={state.useEntireSheet}
                            />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <NumberInput
                                radius="md"
                                hideControls
                                value={startRow ?? null}
                                onChange={val => setRange({ sr: val })}
                                placeholder="1"
                                disabled={state.useEntireSheet}
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
                                disabled={state.useEntireSheet}
                            />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <NumberInput
                                radius="md"
                                hideControls
                                value={endRow ?? null}
                                onChange={val => setRange({ er: val })}
                                placeholder="3"
                                disabled={state.useEntireSheet}
                            />
                        </Grid.Col>
                    </Grid>
                </Control>

                <Control>
                    <ControlLabel info={<Text>
                        The row of the table which contains the headers (column names) for the table. <br /> <b>Headers are required.</b>
                    </Text>}>
                        Header Row
                    </ControlLabel>
                    <Group spacing="xl">
                        <NumberInput
                            value={state.headerRow}
                            onChange={val => setState({ headerRow: val })}
                            placeholder="1"
                            w={140}
                            min={1}
                        />
                    </Group>
                </Control>

                <Control>
                    <ControlLabel info="The row of the table on which the data starts.">
                        Data Start Row
                    </ControlLabel>
                    <NumberInput
                        value={state.startRow}
                        onChange={val => setState({ startRow: val })}
                        placeholder="2"
                        w={140}
                        min={(state.headerRow ?? 1) + 1}
                    />
                </Control>
            </ControlStack>
        )
    },
}