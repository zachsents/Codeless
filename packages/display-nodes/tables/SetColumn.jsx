import { Stack, Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components"


export default {
    id: "tables:SetColumn",
    name: "Set Column",
    description: "Sets a column's value in a table or row.",
    icon: Table,
    color: "yellow",
    badge: "Tables",

    inputs: [
        {
            name: "table",
            label: "Table or Row",
        },
        "value",
    ],
    outputs: [
        {
            name: "tableOut",
            label: "Table or Row"
        }
    ],

    defaultState: {
        column: "",
    },


    renderNode: ({ state, alignHandles }) => {
        
        alignHandles(["table", "tableOut"], null)

        return (
            <Stack
                spacing={0}
                align="center"
                ref={el => alignHandles("value", el)}
            >
                {state.column ?
                    <>
                        <Text color="dimmed">Set column</Text>
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
                    <ControlLabel info="The column you want to set the data for.">
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
