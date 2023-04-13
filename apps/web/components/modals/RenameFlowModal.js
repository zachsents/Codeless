import { useState } from "react"
import { Button, Group, Stack, TextInput } from "@mantine/core"
import { TbPencil } from "react-icons/tb"
import { useRenameFlow } from "@minus/client-sdk"


export default function RenameFlowModal({ context, id, innerProps: { flowId, oldName = "" } }) {

    const renameFlow = useRenameFlow(flowId)
    const [loading, setLoading] = useState(false)
    const [newName, setNewName] = useState(oldName)

    const handleSubmit = async event => {
        event.preventDefault()

        if (!newName)
            return

        setLoading(true)
        await renameFlow(newName)
        context.closeModal(id)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="xl" mt="xl">
                <TextInput
                    data-autofocus
                    value={newName}
                    onChange={event => setNewName(event.currentTarget.value)}
                    placeholder="Enter a new name"
                    disabled={loading}
                />
                <Group position="apart">
                    <Button
                        onClick={() => context.closeModal(id)}
                        radius="xl"
                        variant="subtle"
                        color="red"
                    >
                        Cancel
                    </Button>
                    {!!newName &&
                        <Button
                            type="submit"
                            radius="xl"
                            variant="light"
                            leftIcon={<TbPencil />}
                            loading={loading}
                        >
                            Rename
                        </Button>}
                </Group>
            </Stack>
        </form>
    )
}
