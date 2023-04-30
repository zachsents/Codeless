import { Button, Center, Group, Loader, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Check } from "tabler-icons-react"


export default function OAuthIntegration({ id, app, manager, disconnectLabel }) {

    const [loading, setLoading] = useState(true)

    const { data: isAuthorized, refetch, isLoading } = useQuery({
        queryKey: ["app-integration", app?.id, id],
        queryFn: () => manager.isAppAuthorized(app),
        retry: false,
    })

    const handleConnect = () => {
        setLoading(true)
        manager.authorizeAppInPopup(app.id)
    }

    const handleDisconnect = async () => {
        setLoading(true)
        await manager.disconnect(app.id)
        refetch()
    }

    // when app is loaded or authorization state changes, clear loading state
    useEffect(() => {
        setLoading(false)
    }, [isAuthorized])

    const disconnectButton = <Button
        onClick={handleDisconnect}
        size="xs"
        compact
        variant="light"
        color="gray"
    >
        Disconnect
    </Button>

    return (
        <Center pr="md">
            {loading || isLoading ?
                <Loader size="sm" />
                :
                isAuthorized ?
                    <Group>
                        <Stack spacing="xs">
                            <Text color="green">Connected!</Text>
                            {disconnectLabel ?
                                <Tooltip label={disconnectLabel}>{disconnectButton}</Tooltip> :
                                disconnectButton}
                        </Stack>
                        <ThemeIcon size="lg" color="green" radius="xl"><Check size={18} /></ThemeIcon>
                    </Group>
                    :
                    <Button onClick={handleConnect}>
                        Connect
                    </Button>}
        </Center>
    )
}