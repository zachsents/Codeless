import { Box, Button, Center, Divider, Group, Loader, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Check } from "tabler-icons-react"


export default function OAuthIntegration({ id, app, manager, disconnectLabel }) {

    const [isConnecting, setConnecting] = useState(true)

    const { data: isAuthorized, refetch, isLoading } = useQuery({
        queryKey: ["app-integration", app?.id, id],
        queryFn: () => manager.isAppAuthorized(app),
        retry: false,
        refetchOnMount: false,
    })

    const connect = () => {
        setConnecting(true)
        manager.authorizeAppInPopup(app.id)
    }

    const disconnect = async () => {
        setConnecting(true)
        await manager.disconnect(app.id)
        refetch()
    }

    // when app is loaded or authorization state changes, clear loading state
    useEffect(() => {
        setConnecting(false)
    }, [!!isAuthorized])

    const disconnectButton = <Button
        onClick={disconnect} loading={isConnecting}
        size="xs" variant="subtle" color="red"
    >
        Disconnect
    </Button>

    return (
        <Group>
            {isAuthorized && <>
                <ThemeIcon color="green" size="sm" radius="xl"><Check size="0.75rem" /></ThemeIcon>
                <Divider orientation="vertical" />
            </>}

            {isLoading ?
                <Loader size="xs" />
                :
                isAuthorized ?
                    disconnectLabel ?
                        <Tooltip label={disconnectLabel} withinPortal>{disconnectButton}</Tooltip> :
                        disconnectButton
                    :
                    <Button onClick={connect} loading={isConnecting} size="xs" variant="subtle">
                        Connect
                    </Button>}
        </Group>
    )
}