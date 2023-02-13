import Link from "next/link"
import { Button, Container, Grid, Group, Header, Menu, Stack, Text, Title } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import { TbPlus, TbUser } from "react-icons/tb"
import { signOut, useAppDetailsForUserRealtime } from "@minus/client-sdk"

import { useMustBeSignedIn } from "../modules/hooks"
import AppCard from "../components/cards/AppCard"
import ArticleCard from "../components/cards/ArticleCard"
import Search from "../components/Search"


export default function Dashboard() {

    const user = useMustBeSignedIn()
    const [apps] = useAppDetailsForUserRealtime(user?.uid)

    const handleOpenCreateAppModal = () => {
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
                                <Menu.Item onClick={signOut}>Sign Out</Menu.Item>
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
                                <Button onClick={handleOpenCreateAppModal} radius="md" variant="light" leftIcon={<TbPlus />}>
                                    New App
                                </Button>
                            </Group>

                            <Search
                                list={apps}
                                selector={app => app.name}
                                noun="app"
                                component={AppCard}
                                componentItemProp="app"
                                inputProps={{ mb: "xl" }}
                            />
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