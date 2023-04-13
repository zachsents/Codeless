import { useState } from "react"
import { Button, Group, Stack, TextInput } from "@mantine/core"
import { useRouter } from "next/router"
import { useCreateApp } from "@minus/client-sdk"


export default function CreateAppModal({ context, id, /*  innerProps */ }) {

    const router = useRouter()

    const createApp = useCreateApp()
    const [appName, setAppName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async event => {
        event.preventDefault()

        if (!appName)
            return

        setLoading(true)
        const { id: newAppId } = await createApp(appName)
        router.push(`/app/${newAppId}`)
        context.closeModal(id)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing="xl" mt="xl">
                <TextInput
                    data-autofocus
                    size="lg"
                    value={appName}
                    onChange={event => setAppName(event.currentTarget.value)}
                    placeholder="Next big unicorn SaaS"
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
                    {appName &&
                        <Button
                            type="submit"
                            radius="xl"
                            variant="light"
                            loading={loading}
                        >
                            Create "{appName}"
                        </Button>}
                </Group>
            </Stack>
        </form>
    )
}
