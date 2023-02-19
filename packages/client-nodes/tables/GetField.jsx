import { Stack, Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components"


export default {
    id: "tables:GetField",
    name: "Get Field",
    description: "Gets a specific field from a row or set of rows.",
    icon: Table,
    color: "yellow",
    badge: "Tables",

    inputs: [
        {
            name: "rows",
            label: "Row(s)",
        }
    ],
    outputs: ["field"],

    defaultState: {
        field: "",
    },


    renderNode: ({ state, alignHandles }) => {
        const align = el => alignHandles(["rows", "field"], el)

        return (
            <Stack spacing={0} align="center" ref={align}>
                {state.field ?
                    <>
                        <Text color="dimmed">Get field</Text>
                        <Text weight={500}>"{state.field}"</Text>
                    </>
                    :
                    <Text color="dimmed" size="xs">No field specified</Text>
                }
            </Stack>
        )
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The field you want the data from.">
                        Field
                    </ControlLabel>
                    <TextInput
                        value={state.field ?? ""}
                        onChange={event => setState({ field: event.currentTarget.value })}
                        placeholder="Field Name"
                    />
                </Control>
            </ControlStack>
        )
    }
}
