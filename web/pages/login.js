import { BackgroundImage, Button, Center, Loader, Stack, Text, TextInput, Title } from "@mantine/core"
import { signInWithGoogle, sendEmailSignInLink } from "@minus/client-sdk"
import { useForm } from "@mantine/form"
import { useState } from "react"
import { useRouter } from "next/router"
import { createLinearGradient } from "../modules/colors"
import { BsGoogle } from "react-icons/bs"


const SignInMethod = {
    Email: "email",
    Google: "google",
}


export default function Login() {

    const [signInMethod, setSignInMethod] = useState()

    const router = useRouter()

    const handleLogin = result => {
        console.debug("Logged in as", result.user.displayName ?? result.user.email)
        router.push("/dashboard")
    }

    return (
        <BackgroundImage src="/photon-bg.svg">
            <Center sx={containerStyle} pb={100}>

                <Stack w={400}>
                    {!signInMethod && <>
                        <Title align="center" weight={400} color="dimmed">
                            Welcome to
                            <Text component="span" weight={600} sx={minusTitleStyle}> minus</Text>
                        </Title>

                        <Button
                            size="xl"
                            leftIcon={<BsGoogle />}
                            fullWidth
                            onClick={() => {
                                setSignInMethod(SignInMethod.Google)
                                signInWithGoogle().then(handleLogin).catch(() => setSignInMethod(null))
                            }}
                        >
                            Sign in with Google
                        </Button>

                        <Button
                            fullWidth
                            variant="subtle"
                            onClick={() => setSignInMethod(SignInMethod.Email)}
                        >
                            Sign in with email instead
                        </Button>
                    </>}

                    {signInMethod == SignInMethod.Email && <EmailLogin goBack={() => setSignInMethod(null)} />}
                    {signInMethod == SignInMethod.Google && <GoogleLogin />}
                </Stack>
            </Center>
        </BackgroundImage>
    )
}

const containerStyle = ({
    width: "100vw",
    height: "100vh",
})

const minusTitleStyle = theme => ({
    background: createLinearGradient(theme.colors, "grape"),
    backgroundClip: "text",
    color: "transparent",
})

function EmailLogin({ goBack }) {

    const [loadingState, setLoadingState] = useState(0)

    const form = useForm({
        initialValues: {
            email: "",
            // password: ""
        },
        validate: {
            email: value => !value && "Please enter a valid email",
            // password: value => !value && "Please enter your password",
        }
    })

    const handleSubmit = async values => {
        setLoadingState(1)
        await sendEmailSignInLink(values.email)
        window.localStorage.setItem("signInEmail", values.email)    // save email for after they click link
        setLoadingState(2)
    }

    return loadingState == 2 ?
        <Stack align="center" spacing="xs">
            <Text size="lg">A sign-in link has been sent to your email.</Text>
            <Text color="dimmed">You may close this window.</Text>
        </Stack>
        :
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <Title order={2} weight={400} color="dimmed" align="center">
                    Log in with your email
                </Title>
                <TextInput placeholder="mark@facebook.com" size="xl" {...form.getInputProps("email")} disabled={!!loadingState} />
                <Button type="submit" size="lg" fullWidth loading={!!loadingState}>Next</Button>
                <Button variant="subtle" fullWidth onClick={goBack}>Go back</Button>
            </Stack>
        </form>
}

function GoogleLogin() {
    return (
        <Stack align="center">
            <Text size="lg" align="center" mb={10}>Logging you in...</Text>
            <Loader />
        </Stack>
    )
}