import { useMemo, useState } from "react"
import Link from "next/link"
import fuzzy from "fuzzy"
import { ActionIcon, Button, Container, Grid, Group, Header, Menu, SimpleGrid, Skeleton, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import { TbPlus, TbSearch, TbUser, TbX } from "react-icons/tb"
import { signOut, useAppDetailsForUserRealtime } from "@minus/client-sdk"

import { useMustBeSignedIn, useSearch } from "../modules/hooks"
import AppCard from "../components/cards/AppCard"
import ArticleCard from "../components/cards/ArticleCard"


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

    // handle searching apps
    const [filteredApps, searchQuery, setSearchQuery] = useSearch(apps, app => app.name)

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

                            <TextInput
                                value={searchQuery}
                                onChange={event => setSearchQuery(event.currentTarget.value)}
                                size="lg"
                                radius="lg"
                                placeholder={`Search ${apps?.length ?? ""} app${apps?.length == 1 ? "" : "s"}...`}
                                icon={<TbSearch />}
                                rightSection={searchQuery &&
                                    <ActionIcon radius="md" mr="xl" onClick={() => setSearchQuery("")}>
                                        <TbX />
                                    </ActionIcon>
                                }
                            />
                            <Space h="xs" />

                            {filteredApps?.length == 0 &&
                                <Text align="center" size="lg" color="dimmed">No apps found.</Text>}

                            <SimpleGrid cols={2} verticalSpacing="xl" spacing="xl">
                                {apps ?
                                    filteredApps.map(app => <AppCard app={app} key={app.id} />)
                                    :
                                    <>
                                        <Skeleton height={100} />
                                        <Skeleton height={100} />
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