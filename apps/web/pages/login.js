import { Button, Center, Container, Loader, Stack, Text, TextInput, Title } from "@mantine/core"
import { FcGoogle } from "react-icons/fc"
import { TbMail } from "react-icons/tb"
import { auth, sendEmailSignInLink } from "../modules/firebase"
import { signInWithGoogle } from "firebase-web-helpers"
import { useForm } from '@mantine/form'
import { useState } from "react"
import { useRouter } from 'next/router'
import GoBackButton from "../components/GoBackButton"


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
        <Center sx={{ width: "100vw", height: "100vh" }} pb={100}>
            <Container size="sm" sx={{ minWidth: 400 }}>
                {!signInMethod &&
                    <Stack>
                        <Title order={1} align="center">Welcome! 😁</Title>
                        <Text align="center">Choose a sign-in method</Text>
                        <Button
                            onClick={() => setSignInMethod(SignInMethod.Email)}
                            size="xl"
                            leftIcon={<TbMail />}
                        >
                            Sign in with email
                        </Button>
                        <Button
                            onClick={() => {
                                setSignInMethod(SignInMethod.Google)
                                signInWithGoogle(auth).then(handleLogin).catch(() => setSignInMethod(null))
                            }}
                            size="xl"
                            variant="white"
                            color="dark"
                            leftIcon={<FcGoogle />}
                            sx={theme => ({
                                border: "1px solid " + theme.colors.gray[3]
                            })}
                        >
                            Sign in with Google
                        </Button>
                    </Stack>
                }

                {signInMethod == SignInMethod.Email && <EmailLogin goBack={() => setSignInMethod(null)} />}

                {signInMethod == SignInMethod.Google && <GoogleLogin />}
            </Container>
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
        window.localStorage.setItem("signInEmail", values.email)    // save email for after they click link
        setLoadingState(2)
    }

    return (
        <Stack>
            <GoBackButton onClick={goBack} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Title order={2} align="center" mb={20}>Log in with your email</Title>
                <TextInput placeholder="mark@facebook.com" size="xl" {...form.getInputProps("email")} mb={20} disabled={!!loadingState} />
                {/* <PasswordInput label="Password" placeholder="🤫" size="xl" {...form.getInputProps("password")} mb={20} disabled={loading} /> */}
                <Center>
                    {loadingState == 0 ? <Button type="submit" size="xl">Next</Button> :
                        loadingState == 1 ? <Loader /> : <Text>We've sent a link to your email.</Text>}
                </Center>
            </form>
        </Stack>
    )
}

function GoogleLogin() {
    return (
        <Stack align="center">
            <Text size="xl" align="center" mb={10}>Logging you in...</Text>
            <Loader />
        </Stack>
    )
}