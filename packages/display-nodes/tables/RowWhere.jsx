import { Select, Stack, Text, TextInput } from "@mantine/core"
import { Table } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components"


export default {
    id: "tables:RowWhere",
    name: "Find Row",
    description: "Gets a specific row from a table. Functions similarly to a VLOOKUP.",
    icon: Table,
    color: "yellow",

    inputs: ["$table", "$searchValue"],
    outputs: ["row"],

    defaultState: {
        searchColumn: "",
        compareMethod: "equals",
    },


    renderNode: ({ state, containerComponent: ContainerComponent, alignHandles }) => {
        return state.searchColumn ?
            <Stack spacing={0}>
                <Text align="center" size="xs" color="dimmed">Find a row where</Text>
                <Text align="center" size="xs" weight={500}>"{state.searchColumn}"</Text>
                <Text align="center" size="xs" color="dimmed">{state.compareMethod}</Text>
                <SkeletonWithHandle align="left" ref={el => alignHandles("$searchValue", el)} />
            </Stack>
            :
            <ContainerComponent>
                <Text size="xs">Find Row</Text>
            </ContainerComponent>
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
                        ]}
                        value={state.compareMethod ?? ""}
                        onChange={val => setState({ compareMethod: val })}
                    />
                </Control>
            </ControlStack>
        )
    }
}
