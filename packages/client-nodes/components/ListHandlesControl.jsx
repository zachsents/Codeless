import { ActionIcon, Button, Grid, TextInput } from "@mantine/core"
import produce from "immer"
import { Fragment } from "react"
import { Plus, X } from "tabler-icons-react"



export default function ListHandlesControl({
    handleName,
    listHandles,
    state,
    setState,
    stateKey = "dataLabels",
    controlTitle,
    controlInfo,
    addLabel,
    inputPlaceholder,
}) {

    const handleRemove = i => {
        listHandles.remove(handleName, i)
        setState({
            [stateKey]: produce(state[stateKey], draft => {
                draft.splice(i, 1)
            })
        })
    }

    return (
        <>
            <Grid align="center">
                {Array(listHandles.handles?.[handleName] ?? 0).fill(0).map((_, i) =>
                    <Fragment key={handleName + i}>
                        <Grid.Col span={10}>
                            <TextInput
                                placeholder={inputPlaceholder}
                                radius="md"
                                value={state[stateKey]?.[i] ?? ""}
                                onChange={event => setState({
                                    [stateKey]: produce(state[stateKey], draft => {
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
                onClick={() => listHandles.add(handleName)}
            >
                {addLabel}
            </Button>
        </>
    )
}