import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { finishEmailSignIn } from "@minus/client-sdk"
import { Loader, Stack, Text } from "@mantine/core"


export default function FinishEmailSignIn() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const router = useRouter()

    useEffect(() => {
        finishEmailSignIn()
            .then(result => {
                setLoading(false)
                if (result) {
                    console.debug("Logged in as", result.user.displayName ?? result.user.email)
                    router.push("/dashboard")
                }
                else
                    setError("Sign-in result is undefined.")
            })
            .catch(error => {
                console.error(error)
                setError(error)
            })
    }, [])

    return (
        <Stack align="center" mt={50}>
            {loading && <Loader />}
            {error ? <Text size="xl">Uh oh. We ran into an issue signing you in. Please try again.</Text> :
                <Text size="xl" align="center" mb={10}>You"ve been signed in!</Text>}
        </Stack>
    )
}
