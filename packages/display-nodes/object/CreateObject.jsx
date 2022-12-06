import { Vector, Plus, X } from "tabler-icons-react"
import { Button, Group, Tooltip, Stack, TextInput, ThemeIcon, Text, ActionIcon, Box } from "@mantine/core"
import { useEffect } from "react"
import { produce } from "immer"
import { useState } from "react"


export default {
    name: "Create Object",
    description: "Creates an object.",
    icon: Vector,
    valueSources: [" "],

    defaultState: { $: { } },

    default: ({ state, setState, defaultState }) => {

        const [entries, setEntries] = useState(Object.entries(state.$ || defaultState.$))

        const handleKeyChange = (oldKey, newKey) => {
            state.$[newKey] === undefined &&
                setEntries(
                    produce(entries, draft => {
                        draft.find(entry => entry[0] == oldKey)[0] = newKey
                    })
                )
        }

        const handleValueChange = (key, val) => {
            const parsed = parseFloat(val)
            setEntries(
                produce(entries, draft => {
                    draft.find(entry => entry[0] == key)[1] = isNaN(parsed) ? val : parsed
                })
            )
        }

        const handleAddEntry = () => {
            state.$[""] === undefined &&
                setEntries([...entries, ["", ""]])
        }

        const handleDeleteEntry = key => {
            setEntries(
                produce(entries, draft => {
                    const index = draft.findIndex(entry => entry[0] == key)
                    draft.splice(index, 1)
                })
            )
        }

        useEffect(() => {
            setState({ $: Object.fromEntries(entries) })
        }, [entries])

        // console.log(Object.entries(state.$ ?? {}).map(([key, val]) => `${key}, ${val} (${typeof val})`).join("\n"))

        return (
            <Stack spacing={5}>
                {typeof state.$ === "object" &&
                    entries.map(([key, val], i) =>
                        <Group position="center" spacing={5} key={i}>
                            <Group grow position="center" w={220}>
                                <TextInput
                                    value={key ?? null}
                                    onChange={event => handleKeyChange(key, event.currentTarget.value)}
                                    size="xs"
                                    placeholder="Key"
                                />
                                <TextInput
                                    value={val ?? null}
                                    onChange={event => handleValueChange(key, event.currentTarget.value)}
                                    size="xs"
                                    placeholder="Value"
                                />
                            </Group>
                            <ActionIcon onClick={() => handleDeleteEntry(key)} variant="subtle" color="red" size="md" radius="xl">
                                <X size={10} />
                            </ActionIcon>
                        </Group>
                    )}
                <Tooltip label={<Text size="xs">Add Property</Text>}>
                    <Button disabled={state.$?.[""] !== undefined} onClick={handleAddEntry} variant="subtle" size="xs">
                        <ThemeIcon radius="xl" size="sm">
                            <Plus size={12} />
                        </ThemeIcon>
                    </Button>
                </Tooltip>
            </Stack>
        )
    },
}