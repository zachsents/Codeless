import { Box, Button, Group, Loader, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core"
import { disconnectIntegration, functions } from "@minus/client-sdk"
import { httpsCallable } from "firebase/functions"
import { useEffect, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { SiGooglesheets } from "react-icons/si"
import { TbExclamationMark, TbForms } from "react-icons/tb"
import { useQuery } from "react-query"
import { BrandGmail } from "tabler-icons-react"


export default {
    id: "google",
    name: "Google",
    icon: FcGoogle,
    color: "white",

    authorizationFunction: "google-authorizeApp",
    checkAuthorizationFunction: "google-checkAuthorization",

    scopeSets: [
        {
            id: "gmail",
            name: "Gmail",
            icon: BrandGmail,
            color: "red",
            scopes: [
                "https://www.googleapis.com/auth/gmail.modify",
            ],
        },
        {
            id: "sheets",
            name: "Sheets",
            icon: SiGooglesheets,
            color: "green",
            scopes: [
                "https://www.googleapis.com/auth/spreadsheets",
            ],
        },
        {
            id: "forms",
            name: "Forms",
            icon: TbForms,
            color: "violet",
            scopes: [
                "https://www.googleapis.com/auth/forms.body",
            ],
        },
    ],

    renderAccount: ({ children, app, accountId, id, checkAuthorizationFunction, scopeSets }) => {

        // Query to check if account is authorized
        const { data: authorizedScopes, refetch, isLoading } = useQuery({
            queryKey: ["authorized-scopes", accountId],
            queryFn: () => httpsCallable(functions, checkAuthorizationFunction)({
                accountId,
                requiredScopes: [],
            }).then(res => res.data),
        })

        // Convert to list of services
        const authorizedServices = scopeSets.filter(set => set.scopes.every(scope => authorizedScopes?.includes(scope))).map(set => set.name).join(", ")

        // Disconnecting state
        const [isDisconnecting, setDisconnecting] = useState(true)

        // Disconnect from integration
        const disconnect = async () => {
            setDisconnecting(true)
            await disconnectIntegration(app?.id, id, accountId)
            refetch()
        }

        // Side-effect: When app is loaded or authorization state changes, clear connecting state
        useEffect(() => {
            setDisconnecting(false)
        }, [authorizedScopes])

        return (
            <Group position="apart">
                <Stack spacing="xxxs">
                    <Box>
                        {children}
                    </Box>
                    <Text size="xxs" color="dimmed">Connected to {authorizedServices}</Text>
                </Stack>

                {isLoading ?
                    <Loader size="xs" /> :
                    <Group spacing="xs">
                        {!authorizedScopes &&
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
                            onClick={disconnect} loading={isDisconnecting}
                            size="xs" variant="subtle" color="gray"
                        >
                            Disconnect
                        </Button>
                    </Group>}
            </Group>
        )
    },
}