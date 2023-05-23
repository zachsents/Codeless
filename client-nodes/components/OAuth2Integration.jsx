import { Box, Button, Center, Divider, Group, Loader, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core"
import { disconnectIntegration, functionUrl, functions } from "@minus/client-sdk"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Check } from "tabler-icons-react"
import { httpsCallable } from "firebase/functions"
import { TbExclamationMark } from "react-icons/tb"


export default function OAuth2Integration({ children, app, accountId, id, checkAuthorizationFunction }) {

    const [isConnecting, setConnecting] = useState(true)

    // Query to check if account is authorized
    const { data: isAuthorized, refetch, isLoading } = useQuery({
        queryKey: ["is-account-authorized", accountId],
        queryFn: () => {
            // If auth function is a string, use it as a callable function
            if (typeof checkAuthorizationFunction === "string")
                return httpsCallable(functions, checkAuthorizationFunction)({ accountId }).then(res => res.data)

            // Otherwise, assume it's a function that returns a promise
            return checkAuthorizationFunction({ accountId })
        },
    })

    // Disconnect from integration
    const disconnect = async () => {
        setConnecting(true)
        await disconnectIntegration(app?.id, id, accountId)
        refetch()
    }

    // Side-effect: When app is loaded or authorization state changes, clear connecting state
    useEffect(() => {
        setConnecting(false)
    }, [!!isAuthorized])


    return (
        <Group position="apart">
            {children}

            {isLoading ?
                <Loader size="xs" /> :
                <Group spacing="xs">
                    {!isAuthorized &&
                        <Tooltip multiline label={
                            <Text size="xxs" align="center" maw="8rem" >
                                There's a problem with this account. Try disconnecting and reconnecting it.
                            </Text>
                        }>
                            <ThemeIcon color="red" size="xs" radius="xl">
                                <TbExclamationMark />
                            </ThemeIcon>
                        </Tooltip>}

                    <Button
                        onClick={disconnect} loading={isConnecting}
                        size="xs" variant="subtle" color="gray"
                    >
                        Disconnect
                    </Button>
                </Group>}
        </Group>
    )
}