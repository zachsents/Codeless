import { Stack, Switch, Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, RequiresConfiguration, SkeletonWithHandle } from "../components/index"


export default {
    id: "tables:FindRowsByField",
    name: "Find Rows By Field",
    description: "Searches for rows with a a certain value for the specified field. For more advanced searching, try the Query Rows node.",
    icon: Table,
    color: "yellow",
    badge: "tables",

    inputs: ["$table", "value"],
    outputs: [
        {
            name: "rows",
            label: "Row(s)",
        }
    ],

    defaultState: {
        multiple: true,
    },

    renderName: ({ state }) => `Find Row${state.multiple ? "s" : ""} By Field`,

    renderNode: ({ state, alignHandles }) => {

        alignHandles("$table")

        return (
            <RequiresConfiguration dependencies={[state.field]}>
                <Stack spacing="xs" align="center">
                    <Text color="dimmed" align="center" maw={240}>
                        Find {state.multiple ? "rows" : "a row"} where&nbsp;
                        <Text color="dark" weight={500} component="span">
                            "{state.field}"
                        </Text> is
                    </Text>

                    <SkeletonWithHandle maw={200} align="left" ref={el => alignHandles("value", el)} />
                </Stack>
            </RequiresConfiguration>
        )
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel bold info="The field you want to search by.">
                        Field
                    </ControlLabel>
                    <TextInput
                        placeholder="Column 1, User ID, Email, etc."
                        value={state.field}
                        onChange={event => setState({ field: event.currentTarget.value })}
                    />
                </Control>

                <Control>
                    <ControlLabel info="Whether you want just one row or multiple.">
                        Find Multiple
                    </ControlLabel>
                    <Switch
                        checked={state.multiple}
                        onChange={event => setState({ multiple: event.currentTarget.checked })}
                    />
                </Control>
            </ControlStack>
        )
    },

}