import { Box, Button, Card, Center, Loader, Space, Stack, Text, TextInput, Title, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useLocalStorage } from "@mantine/hooks"
import { sendEmailSignInLink, signInWithGoogle } from "@minus/client-sdk"
import Brand from "@web/components/Brand"
import { useMustNotBeSignedIn } from "@web/modules/hooks"
import { useRouter } from "next/router"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { TbArrowLeft, TbMail } from "react-icons/tb"


const SignInMethod = {
    Email: "email",
    Google: "google",
}


export default function Login() {

    const theme = useMantineTheme()
    const router = useRouter()

    useMustNotBeSignedIn()

    const [signInMethod, setSignInMethod] = useState()

    const [hasLoggedIn, setHasLoggedIn] = useLocalStorage({ key: "has-logged-in" })

    const handleLogin = result => {
        console.debug("Logged in as", result.user.displayName ?? result.user.email)
        setHasLoggedIn(true)
        router.push("/apps")
    }

    return (
        <Center w="100vw" h="100vh" pb={100} pos="relative">
            <Card w={350} withBorder shadow="sm" p="xl">
                <Stack spacing="xs">
                    {!signInMethod && <>
                        <Title align="center" size="1.5rem">
                            Sign {hasLoggedIn ? "in to" : "up for"}
                            <Text component="span" weight={600} color={theme.primaryColor}> minus</Text>
                        </Title>
                        <Text size="sm" color="dimmed" align="center">
                            If you don't have an account, one will be created.
                        </Text>

                        <Space h="xs" />

                        <Button
                            variant="light"
                            color="gray"
                            radius="xl"
                            leftIcon={<FcGoogle />}
                            onClick={() => {
                                setSignInMethod(SignInMethod.Google)
                                signInWithGoogle().then(handleLogin).catch(() => setSignInMethod(null))
                            }}
                        >
                            Sign in with Google
                        </Button>

                        <Button
                            radius="xl"
                            variant="light"
                            leftIcon={<TbMail />}
                            onClick={() => setSignInMethod(SignInMethod.Email)}
                        >
                            Sign in with email instead
                        </Button>
                    </>}

                    {signInMethod == SignInMethod.Email && <EmailLogin goBack={() => setSignInMethod(null)} />}
                    {signInMethod == SignInMethod.Google && <GoogleLogin />}
                </Stack>
            </Card>

            <Box px="xl" py="sm" className="absolute top-0 left-0">
                <Brand variant="gray" />
            </Box>
        </Center>
    )
}

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
        window.localStorage.setItem("sign-in-email", values.email)    // save email for after they click link
        setLoadingState(2)
    }

    return loadingState == 2 ?
        <>
            <Text align="center">A sign-in link has been sent to your email.</Text>
            <Text size="sm" color="dimmed" align="center">You may close this window.</Text>
        </>
        :
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="xs">
                <Text color="dimmed" align="center">
                    Enter your email
                </Text>
                <TextInput
                    placeholder="mark@facebook.com"
                    type="email"
                    {...form.getInputProps("email")}
                    disabled={!!loadingState}
                />

                <Space h="xs" />

                <Button type="submit" loading={!!loadingState}>
                    Next
                </Button>
                <Button leftIcon={<TbArrowLeft />} variant="subtle" onClick={goBack}>
                    Go back
                </Button>
            </Stack>
        </form>
}

function GoogleLogin() {

    const theme = useMantineTheme()

    return (
        <>
            <Text align="center">Logging you in...</Text>
            <Text align="center" size="xs" color="dimmed">
                Sign in through the popup. If there's a problem, try{" "}
                <Text component="a" href="/login" color={theme.primaryColor}>refreshing</Text>.
            </Text>
            <Center>
                <Loader />
            </Center>
        </>
    )
}