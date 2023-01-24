import { Select, Stack, Switch, Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components"


export default {
    id: "tables:RowWhere",
    name: "Find Rows",
    description: "Gets a specific row from a table. Functions similarly to a VLOOKUP.",
    icon: Table,
    color: "yellow",
    badge: "Tables",

    inputs: ["$table", "$searchValue"],
    outputs: ["row"],

    defaultState: {
        searchColumn: "",
        compareMethod: "equals",
        multiple: false,
    },

    renderName: ({ state }) => `Find Row${state.multiple ? "s" : ""}`,

    renderNode: ({ state, alignHandles }) => {

        alignHandles("$table", null)

        return state.searchColumn ?
            <Stack spacing={0} align="center">
                <Text color="dimmed">Find {state.multiple ? "rows" : "a row"} where</Text>
                <Text weight={500}>"{state.searchColumn}"</Text>
                <Text color="dimmed">{state.compareMethod}</Text>
                <SkeletonWithHandle align="left" ref={el => alignHandles("$searchValue", el)} />
            </Stack>
            :
            <Text size="xs" color="dimmed">No parameters specified</Text>
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The column you're searching in.">
                        Search Column
                    </ControlLabel>
                    <TextInput
                        value={state.searchColumn ?? ""}
                        onChange={event => setState({ searchColumn: event.currentTarget.value })}
                        placeholder="Column Name"
                    />
                </Control>

                <Control>
                    <ControlLabel info='The method used for searching. "Equals" will look for an exact match, while "Contains" will match any substring.'>
                        Search Method
                    </ControlLabel>
                    <Select
                        data={[
                            { label: "Equals", value: "equals" },
                            { label: "Contains", value: "contains" },
                            { label: "Matches Regex", value: "matches Regex" },
                        ]}
                        value={state.compareMethod ?? ""}
                        onChange={val => setState({ compareMethod: val })}
                    />
                </Control>

                <Control>
                    <ControlLabel info="Whether you want to find a single row or multiple rows.">
                        Find Multiple Rows
                    </ControlLabel>
                    <Switch
                        checked={state.multiple}
                        onChange={event => setState({ multiple: event.currentTarget.checked })}
                    />
                </Control>
            </ControlStack>
        )
    }
}
