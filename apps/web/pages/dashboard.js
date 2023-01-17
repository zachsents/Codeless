import { Box, Button, Container, Grid, Group, Header, Menu, SimpleGrid, Skeleton, Space, Stack, Tabs, Text, TextInput, Title } from "@mantine/core"
import { signOut, mapSnapshot } from "firebase-web-helpers"
import { collection, query, where } from "firebase/firestore"
import Link from "next/link"
import { TbPlus, TbSearch, TbUser, TbUserCircle } from "react-icons/tb"
import AppCard from "../components/cards/AppCard"
import ArticleCard from "../components/cards/ArticleCard"
import { auth, firestore, useMustBeSignedIn } from "../modules/firebase"
import { useRealtimeState } from "../modules/hooks"
import { openContextModal } from '@mantine/modals'


export default function Dashboard() {

    const user = useMustBeSignedIn()

    const [apps] = useRealtimeState(
        user && query(
            collection(firestore, "apps"),
            where("owner", "==", user.uid)
        ),
        mapSnapshot
    )

    const handleCreateApp = () => {
        openContextModal({
            modal: "CreateApp",
            innerProps: {},
            title: <Title order={3}>Name your new app 🔥</Title>,
            size: "lg",
        })
    }

    return (
        <>
            <Header px="xl" py="sm" sx={headerStyle} withBorder={false}>
                <Grid align="center">
                    <Grid.Col span="content">
                        <Text size="xl" weight="bold">minus</Text>
                    </Grid.Col>

                    <Grid.Col span="auto">
                        <Group position="right">
                            <Link href="#">
                                <Button variant="subtle" radius="md">Product</Button>
                            </Link>
                            <Link href="#">
                                <Button variant="subtle" radius="md">Pricing</Button>
                            </Link>
                            <Link href="#">
                                <Button variant="subtle" radius="md">Resources</Button>
                            </Link>
                        </Group>
                    </Grid.Col>

                    <Grid.Col span="content" ml={40}>
                        <Menu position="bottom-end" width={200} shadow="lg" styles={{ dropdown: { border: "none" } }}>
                            <Menu.Target>
                                <Button color="gray" radius="md" variant="light" rightIcon={<TbUser fontSize={18} />}>
                                    <Text color="dimmed">Hey, {user?.displayName || user?.email}</Text>
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => signOut(auth)}>Sign Out</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Grid.Col>
                </Grid>
            </Header>

            <Container size="lg" mt={60}>
                <Grid gutter={100}>
                    <Grid.Col span="auto">
                        <Stack spacing="xl">
                            <Group position="apart">
                                <Title>Your Apps</Title>
                                <Button onClick={handleCreateApp} radius="md" variant="light" leftIcon={<TbPlus />}>
                                    New App
                                </Button>
                            </Group>

                            <TextInput
                                size="lg"
                                placeholder={`Search ${apps?.length ?? ""} apps...`}
                                icon={<TbSearch />}
                            />
                            <Space h="xs" />

                            <SimpleGrid cols={2} verticalSpacing="xl" spacing="xl">
                                {apps ?
                                    apps.map(app => <AppCard app={app} key={app.id} />)
                                    :
                                    <>
                                        <Skeleton height={200} />
                                        <Skeleton height={200} />
                                    </>
                                }
                            </SimpleGrid>
                        </Stack>
                    </Grid.Col>

                    <Grid.Col span={4}>
                        <Stack spacing="xl">
                            <Title order={2}>Need inspiration?</Title>

                            <ArticleCard title="Connect your app to AirTable" />
                            <ArticleCard title="Minus + Webflow = Full Stack app" placeholder={2} />
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </>
    )
}


const headerStyle = theme => ({
    backgroundColor: theme.colors.gray[1],
})