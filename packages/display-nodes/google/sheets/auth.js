import { signInWithGoogle, useAuthState } from "firebase-web-helpers"
import { Button, Group } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"


export default {
    title: "Google Sheets",
    icon: SiGooglesheets,
    color: "teal.5",
    component: ({ firebaseAuth }) => {

        // useSheetsAuth(firebaseAuth)

        const handleClick = async () => {
            const res = await signInWithGoogle(firebaseAuth, ["https://www.googleapis.com/auth/spreadsheets"])

            // TO DO: save credentials
        }

        return (
            <Group>
                <Button onClick={handleClick}>Authorize</Button>
            </Group>
        )
    },
}