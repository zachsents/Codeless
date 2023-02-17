import { Stack, Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components"


export default {
    id: "tables:Column",
    name: "Get Column",
    description: "Gets a specific column from a table.",
    icon: Table,
    color: "yellow",
    badge: "Tables",

    inputs: [
        {
            name: "table",
            label: "Table or Row",
        }
    ],
    outputs: ["column"],

    defaultState: {
        column: "",
    },


    renderNode: ({ state, alignHandles }) => {
        const align = el => alignHandles(["table", "column"], el)

        return (
            <Stack spacing={0} align="center" ref={align}>
                {state.column ?
                    <>
                        <Text color="dimmed">Get column</Text>
                        <Text weight={500}>"{state.column}"</Text>
                    </>
                    :
                    <Text color="dimmed" size="xs">No column specified</Text>
                }
            </Stack>
        )
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The column you want the data from.">
                        Column
                    </ControlLabel>
                    <TextInput
                        value={state.column ?? ""}
                        onChange={event => setState({ column: event.currentTarget.value })}
                        placeholder="Column Name"
                    />
                </Control>
            </ControlStack>
        )
    }
}
