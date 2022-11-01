import { Button, Center, Container, Loader, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { FcGoogle } from "react-icons/fc"
import { TbMail } from "react-icons/tb"
import { sendEmailSignInLink, signInWithGoogle } from "../modules/firebase"
import { useForm } from '@mantine/form'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import GoBackButton from "../components/GoBackButton"

const SignInMethod = {
    Email: "email",
    Google: "google",
}

export default function Login() {

    const [signInMethod, setSignInMethod] = useState()

    const router = useRouter()

    const handleLogin = user => {
        console.debug("Logged in as", user.displayName ?? user.email)
        router.push("/dashboard")
    }

    return (
        <Container size="sm" mt={50}>
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
                            signInWithGoogle().then(handleLogin).catch(() => setSignInMethod(null))
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
                <Text size="xl" align="center">Log in with your email</Text>
                <TextInput label="Email" placeholder="mark@facebook.com" size="xl" {...form.getInputProps("email")} mb={20} disabled={!!loadingState} />
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