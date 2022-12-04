import { signInWithGoogle } from "firebase-web-helpers"
import { Button, Group, Loader, ThemeIcon } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { TbCheck } from "react-icons/tb"
import { httpsCallable } from 'firebase/functions'
import { doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"

const REQUIRED_SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

export default {
    title: "Google Sheets",
    icon: SiGooglesheets,
    color: "teal.5",
    component: ({ app, firestore, functions }) => {

        const [loading, setLoading] = useState(true)

        const isAuthorized = app &&
            (REQUIRED_SCOPES.every(scope => app?.integrations?.Google?.scopes?.includes(scope)) ?? false)

        // click handler -- hit server for auth link and open it
        const handleClick = async () => {

            setLoading(true)

            try {
                const { data: { url: authUrl } } = await httpsCallable(functions, "authorizeGoogleApp")({
                    appId: app.id,
                    scopes: REQUIRED_SCOPES,
                })
                console.debug(`Opening auth URL: ${authUrl}`)
                window.open(authUrl)
            }
            catch (error) {
                console.error("Encountered an error on the server:\n" + error)
            }
        }

        // when authorization state changes, clear loading state
        useEffect(() => {
            typeof isAuthorized === "boolean" && setLoading(false)
        }, [isAuthorized])

        return (
            <Group pr="xl">
                {loading ?
                    <Loader size="sm" />
                    :
                    isAuthorized ?
                        <ThemeIcon size="lg" color="green" radius="xl"><TbCheck size={18} /></ThemeIcon>
                        :
                        <Button onClick={handleClick}>
                            Authorize
                        </Button>}
            </Group>
        )
    },
}
