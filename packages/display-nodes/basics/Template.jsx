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

    inputs: [
        "$template",
        {
            name: "$data",
            list: true,
        }
    ],
    outputs: ["text"],

    defaultState: {
        dataLabels: [],
    },

    renderNode: ({ state, containerComponent: ContainerComponent, alignHandles, listHandles }) => {

        return (
            <Stack spacing="xs">
                <ContainerComponent ref={el => alignHandles(["$template", "text"], el)}>
                    <Text size="xs">Fill Template</Text>
                </ContainerComponent>

                <Space h={0} />

                {Array(listHandles.handles?.["$data"] ?? 0).fill(0).map((_, i) =>
                    <Group
                        spacing="xs"
                        ref={el => alignHandles(`$data.${i}`, el)}
                        key={"data" + i} align="center"
                        ml={-5}
                    >
                        <ArrowRight size={14} />
                        <Text size="xs" >
                            {state.dataLabels?.[i] ?? "<none>"}
                        </Text>
                    </Group>
                )}
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
                    <ControlLabel info="The names of the variables in the template. They will be filled in spots surrounded with curly braces. e.g. {FirstName}, {Email}">
                        Variable Names
                    </ControlLabel>

                    <Grid align="center">
                        {Array(listHandles.handles?.["$data"] ?? 0).fill(0).map((_, i) =>
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
                        onClick={() => listHandles.add("$data")}
                    >
                        Add Variable
                    </Button>
                </Control>
            </ControlStack>
        )
    }
}