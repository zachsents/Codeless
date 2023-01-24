import { Fragment } from "react"
import { ActionIcon, Button, Grid, Group, Space, Stack, Text, TextInput } from "@mantine/core"
import produce from "immer"
import { Template, Plus, X, ArrowRight } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack } from "../components"


export default {
    id: "basic:Template",
    name: "Fill Template",
    description: "Inserts values into a template.",
    icon: Template,
    badge: "Text",

    inputs: [
        "template",
        {
            name: "data",
            list: true,
        }
    ],
    outputs: ["text"],

    defaultState: {
        dataLabels: [],
    },

    renderNode: ({ state, alignHandles, listHandles }) => {

        const numberOfItems = listHandles.handles?.["data"] ?? 0
        alignHandles("template", null)

        return (
            <Stack spacing="xs">
                {numberOfItems ?
                    Array(numberOfItems).fill(0).map((_, i) =>
                        <Group
                            spacing="xs"
                            align="center"
                            ref={el => alignHandles(`data.${i}`, el)}
                            key={"data" + i} 
                        >
                            <ArrowRight size={14} />
                            <Text>
                                {state.dataLabels?.[i] ?? "<none>"}
                            </Text>
                        </Group>
                    )
                    :
                    <Text size="xs" color="dimmed" align="center">No variables</Text>}
            </Stack>
        )
    },

    configuration: ({ state, setState, listHandles }) => {

        const handleRemove = i => {
            listHandles.remove("data", i)
            setState({
                dataLabels: produce(state.dataLabels, draft => {
                    draft.splice(i, 1)
                })
            })
        }

        return (
            <ControlStack>
                <Control>
                    <ControlLabel info="The names of the variables in the template. They will be filled in spots surrounded with curly braces. e.g. {FirstName}, {Email}">
                        Variable Names
                    </ControlLabel>

                    <Grid align="center">
                        {Array(listHandles.handles?.["data"] ?? 0).fill(0).map((_, i) =>
                            <Fragment key={"data" + i}>
                                <Grid.Col span={10}>
                                    <TextInput
                                        placeholder="Variable Name"
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
                        onClick={() => listHandles.add("data")}
                    >
                        Add Variable
                    </Button>
                </Control>
            </ControlStack>
        )
    }
}