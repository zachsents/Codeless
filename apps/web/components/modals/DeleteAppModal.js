import { Button, Group, Stack, TextInput } from "@mantine/core"
import { useDeleteApp } from "@minus/client-sdk"
import { useState } from "react"
import { TbTrash } from "react-icons/tb"


const CONFIRM_MESSAGE = "confirm"

export default function DeleteAppModal({ context, id, innerProps: { appId } }) {

    const deleteApp = useDeleteApp(appId)
    const [loading, setLoading] = useState(false)
    const [confirmation, setConfirmation] = useState("")

    const handleSubmit = async event => {
        event.preventDefault()

        if (confirmation?.toLowerCase() != CONFIRM_MESSAGE)
            return

        setLoading(true)
        await deleteApp()
        context.closeModal(id)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="xl" mt="xl">
                <TextInput
                    value={confirmation}
                    onChange={event => setConfirmation(event.currentTarget.value)}
                    placeholder={`Type "${CONFIRM_MESSAGE}" to delete`}
                />
                <Group position="apart">
                    <Button
                        onClick={() => context.closeModal(id)}
                        radius="xl"
                        variant="subtle"
                    >
                        Cancel
                    </Button>
                    {confirmation?.toLowerCase() == CONFIRM_MESSAGE &&
                        <Button
                            type="submit"
                            radius="xl"
                            variant="light"
                            color="red"
                            leftIcon={<TbTrash />}
                            loading={loading}
                        >
                            Delete
                        </Button>}
                </Group>
            </Stack>
        </form>
    )
}
