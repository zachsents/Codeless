import { signInWithGoogle, useAuthState } from "firebase-web-helpers"
import { Button, Group, Text, ThemeIcon } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { TbCheck } from "react-icons/tb"
import { doc, updateDoc } from "firebase/firestore"

export default {
    title: "Google Sheets",
    icon: SiGooglesheets,
    color: "teal.5",
    component: ({ app, firestore, firebaseAuth }) => {

        const isAuthorized = !!app?.integrations?.GoogleSheets.idToken

        const handleClick = async () => {
            const { credential } = await signInWithGoogle(firebaseAuth, ["https://www.googleapis.com/auth/spreadsheets"])

            // write token to database
            updateDoc(
                doc(firestore, `apps/${app.id}`),
                {
                    "integrations.GoogleSheets.idToken": credential.idToken
                }
            )
        }

        return (
            <Group pr="xl">
                {isAuthorized ?
                    <>
                        {/* <Text color="green" weight={500}>All set!</Text> */}
                        <ThemeIcon size="lg" color="green" radius="xl"><TbCheck size={18} /></ThemeIcon>
                    </>
                    :
                    <Button onClick={handleClick}>Authorize</Button>}
            </Group>
        )
    },
}
