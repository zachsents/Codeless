import { Button, Group, Stack, Text, TextInput } from "@mantine/core"
import { useDeleteApp } from "@minus/client-sdk"
import { useActionQuery } from "@web/modules/hooks"
import { useState } from "react"
import { TbTrash } from "react-icons/tb"


const CONFIRM_MESSAGE = "confirm"

export default function DeleteAppModal({ context, id, innerProps: { appId } }) {

    const _deleteApp = useDeleteApp(appId)
    const [deleteApp, { isFetching: isLoading }] = useActionQuery(_deleteApp, ["delete", appId], {
        onSuccess: () => console.log("deleted app") || context.closeModal(id),
    })

    const [confirmation, setConfirmation] = useState("")

    const handleSubmit = async event => {
        event.preventDefault()

        if (confirmation?.toLowerCase() != CONFIRM_MESSAGE)
            return

        deleteApp()
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="xs">
                <Text color="dimmed" size="sm">
                    This will delete all of its flows, too.
                </Text>

                <TextInput
                    data-autofocus
                    value={confirmation}
                    onChange={event => setConfirmation(event.currentTarget.value)}
                    placeholder={`Type "${CONFIRM_MESSAGE}" to delete`}
                />

                <Group position="apart" mt="xs">
                    <Button
                        onClick={() => context.closeModal(id)}
                        radius="xl" variant="subtle"
                    >
                        Cancel
                    </Button>

                    {confirmation?.toLowerCase() == CONFIRM_MESSAGE &&
                        <Button
                            type="submit"
                            radius="xl" variant="light" color="red"
                            leftIcon={<TbTrash />}
                            loading={isLoading}
                        >
                            Delete
                        </Button>}
                </Group>
            </Stack>
        </form>
    )
}
