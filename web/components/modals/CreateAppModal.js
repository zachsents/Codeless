import { useState } from "react"
import { Button, Group, Stack, TextInput } from "@mantine/core"
import { useRouter } from "next/router"
import { useCreateApp } from "@minus/client-sdk"
import { useActionQuery } from "@web/modules/hooks"
import { notifications } from "@mantine/notifications"


export default function CreateAppModal({ context, id, /*  innerProps */ }) {

    const router = useRouter()

    const [appName, setAppName] = useState("")

    const _createApp = useCreateApp()
    const [createApp, { isFetching: isLoading }] = useActionQuery(() => _createApp(appName), undefined, {
        onSuccess: async newApp => {
            context.closeModal(id)
            await router.push(`/app/${newApp.id}`)

            notifications.show({
                title: "Welcome to your new app!",
                message: "Now it's time to build a workflow!",
                autoClose: 3500,
            })
        },
    })

    const handleSubmit = event => {
        event.preventDefault()
        createApp()
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack>
                <TextInput
                    data-autofocus
                    value={appName}
                    onChange={event => setAppName(event.currentTarget.value)}
                    placeholder="Automations for my business"
                    required
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
                            type="submit" loading={isLoading}
                            radius="xl" variant="light"
                            maw="16rem"
                        >
                            <span className="truncate">Create "{appName}"</span>
                        </Button>}
                </Group>
            </Stack>
        </form>
    )
}
