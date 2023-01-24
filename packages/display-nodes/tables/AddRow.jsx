import { ActionIcon, Button, Grid, Group, Space, Stack, Text, TextInput } from "@mantine/core"
import produce from "immer"
import { Fragment } from "react"
import { Table, Plus, X, ArrowRight } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, SkeletonWithHandle } from "../components"


export default {
    id: "tables:AddRow",
    name: "Add Row",
    description: "Adds a row to a table.",
    icon: Table,
    color: "yellow",
    badge: "Tables",

    inputs: [
        "$table",
        {
            name: "$data",
            list: true,
        }
    ],
    outputs: ["table"],

    defaultState: {
        dataLabels: [],
    },


    renderNode: ({ state, alignHandles, listHandles }) => {

        const numberOfItems = listHandles.handles?.["$data"] ?? 0
        alignHandles(["$table", "table"], null)

        return (
            <Stack spacing="xs">
                {numberOfItems ?
                    Array(numberOfItems).fill(0).map((_, i) =>
                        <Group
                            spacing="xs"
                            ref={el => alignHandles(`$data.${i}`, el)}
                            key={"data" + i} align="center"
                        >
                            <ArrowRight size={14} />
                            <Text>
                                {state.dataLabels?.[i] ?? `Column ${i + 1}`}
                            </Text>
                        </Group>
                    )
                    :
                    <Text size="xs" color="dimmed" align="center">No columns specified</Text>}
            </Stack>
        )
    },

    configuration: ({ state, setState, listHandles }) => {

        const handleRemove = i => {
            listHandles.remove("$data", i)
            setState({
                dataLabels: produce(state.dataLabels, draft => {
                    draft.splice(i, 1)
                })
            })
        }

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The names of the columns to attach to the data. Leave blank if you just want them data added in order.">
                        Column Names
                    </ControlLabel>

                    <Grid align="center">
                        {Array(listHandles.handles?.["$data"] ?? 0).fill(0).map((_, i) =>
                            <Fragment key={"data" + i}>
                                <Grid.Col span={10}>
                                    <TextInput
                                        placeholder="Column Name"
                                        radius="md"
                                        value={state.dataLabels?.[i] ?? ""}
                                        onChange={event => setState({
                                            dataLabels: produce(state.dataLabels, draft => {
                                                draft[i] = event.currentTarget.value
                                            })
                                        })}
                                    />
                                </Grid.Col>

                                <Grid.Col span={2}>
                                    <ActionIcon
                                        radius="md"
                                        color="red"
                                        onClick={() => handleRemove(i)}
                                    >
                                        <X size={14} />
                                    </ActionIcon>
                                </Grid.Col>
                            </Fragment>
                        )}
                    </Grid>

                    <Button
                        mt="xs"
                        size="xs"
                        compact
                        fullWidth
                        radius="sm"
                        leftIcon={<Plus size={14} />}
                        variant="subtle"
                        onClick={() => listHandles.add("$data")}
                    >
                        Add Column
                    </Button>
                </Control>
            </ControlStack>
        )
    }
}
