import { Stack, Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components"


export default {
    id: "tables:Column",
    name: "Column",
    description: "Gets a specific column from a table.",
    icon: Table,
    color: "yellow",

    inputs: [
        {
            name: "$table",
            label: "Table or Row",
        }
    ],
    outputs: ["column"],

    defaultState: {
        column: "",
    },


    renderNode: ({ state, containerComponent: ContainerComponent }) => {
        return state.column ?
            <Stack spacing={0}>
                <Text align="center" size="xs" color="dimmed">Get column</Text>
                <Text align="center" size="xs" weight={500}>"{state.column}"</Text>
            </Stack>
            :
            <ContainerComponent>
                <Text size="xs">Get Column</Text>
            </ContainerComponent>
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
