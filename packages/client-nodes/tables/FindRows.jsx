import { Button, Group, NumberInput, Select, Stack, Switch, Text, TextInput } from "@mantine/core"
import { useEffect, useRef } from "react"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components/index"


export default {
    id: "tables:FindRows",
    name: "Query Rows",
    description: "Searches a table for rows matching the configured filters.",
    icon: Table,
    color: "yellow",
    badge: "Tables",

    inputs: ["$table", "filters",],
    outputs: [
        {
            name: "row",
            label: "Row(s)",
        }
    ],

    defaultState: {
        limit: null,
    },

    renderName: ({ state }) => `Query Row${state.limit == 1 ? "" : "s"}`,

    renderNode: ({ state, alignHandles }) => {

        alignHandles("$table")

        return (
            <Stack spacing="xs" align="center">
                <Text color="dimmed">Find {state.limit == 1 ? "a row" : state.limit == null ? "all rows" : `${state.limit} rows`} where</Text>
                <SkeletonWithHandle align="left" ref={el => alignHandles("filters", el)} />
            </Stack>
        )
    },

    configuration: ({ state, setState }) => {

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The number of rows you want to find. Leave blank to not set a limit.">
                        Limit
                    </ControlLabel>

                    <Group noWrap>
                        <NumberInput
                            placeholder="No limit"
                            value={state.limit}
                            onChange={limit => setState({ limit })}
                            min={1}
                        />
                        <Stack spacing={4}>
                            <Button size="xs" compact variant="subtle" onClick={() => setState({ limit: 1 })}>
                                Single Row
                            </Button>
                            <Button size="xs" compact variant="subtle" onClick={() => setState({ limit: undefined })}>
                                No Limit
                            </Button>
                        </Stack>
                    </Group>
                </Control>
            </ControlStack>
        )
    }
}
