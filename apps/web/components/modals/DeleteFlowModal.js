import { useRouter } from "next/router"
import { Button, Group, Stack, TextInput } from "@mantine/core"
import { useDeleteFlow } from "@minus/client-sdk"
import { useState } from "react"
import { TbTrash } from "react-icons/tb"


const CONFIRM_MESSAGE = "confirm"

export default function DeleteFlowModal({ context, id, innerProps: { flowId, redirectToApp = false } }) {

    const router = useRouter()

    const deleteFlow = useDeleteFlow(flowId)
    const [loading, setLoading] = useState(false)
    const [confirmation, setConfirmation] = useState("")

    const handleSubmit = async event => {
        event.preventDefault()

        if (confirmation?.toLowerCase() != CONFIRM_MESSAGE)
            return

        setLoading(true)
        await deleteFlow()
        context.closeModal(id)

        if (redirectToApp)
            router.push(`/app/${redirectToApp}/flows`)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="xl" mt="xl">
                <TextInput
                    data-autofocus
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
