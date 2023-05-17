import { ActionIcon, Alert, Box, Button, Card, ColorSwatch, Grid, Group, Loader, Menu, SimpleGrid, Space, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { openContextModal } from "@mantine/modals"
import { useAppDetailsForUserRealtime, useFlowCountForApp, useRenameApp, useUpdateApp } from "@minus/client-sdk"
import EditableText from "@web/components/EditableText"
import GlassButton from "@web/components/GlassButton"
import HeaderBase from "@web/components/HeaderBase"
import { NavLink } from "@web/components/NavLink"
import SearchInput from "@web/components/SearchInput"
import Section from "@web/components/Section"
import Footer from "@web/components/landing/Footer"
import { useMustBeSignedIn } from "@web/modules/hooks"
import { useSearch } from "@web/modules/search"
import { jc, pageTitle, stopPropagation } from "@web/modules/util"
import { motion } from "framer-motion"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { TbArrowRight, TbDots, TbPencil, TbPlus, TbTrash } from "react-icons/tb"


export default function AppsPage() {

    const theme = useMantineTheme()

    // user state
    const user = useMustBeSignedIn()

    // apps state
    const [apps] = useAppDetailsForUserRealtime(user?.uid)

    // search apps
    const [filteredApps, query, setQuery, filteredAppNames] = useSearch(apps, {
        selector: app => app.name,
        highlight: true,
    })

    // alert state
    const [alertShowing, setAlertShowing] = useState(true)

    // create app modal
    const createApp = () => openContextModal({
        modal: "CreateApp",
        title: "Name your new app 🔥",
    })

    return (
        <>
            <Head>
                <title key="title">{pageTitle("Your Apps")}</title>
                <meta property="og:title" content={pageTitle("Your Apps")} key="ogtitle" />
            </Head>

            <HeaderBase
                slim
                brandVariant="gray"
                showCTA={false}
                leftSection={
                    <Group spacing="lg">
                        <NavLink href="/apps" size="sm">Your Apps</NavLink>
                    </Group>
                }
                rightSection={
                    <Group spacing="lg">
                        <NavLink href="/docs" size="sm" color={theme.other.halfDimmed}>Docs</NavLink>
                        <NavLink href="/docs/nodes" size="sm" color={theme.other.halfDimmed}>Nodes</NavLink>
                        <NavLink href="/docs/guides" size="sm" color={theme.other.halfDimmed}>Guides</NavLink>
                    </Group>
                }
            />

            <Section size="xs" p="xl">
                <motion.div
                    initial={{ height: "auto" }} animate={{ height: alertShowing ? "auto" : 0 }}
                    className="overflow-hidden"
                >
                    <Alert title="Welcome to Minus!" withCloseButton variant="outline" onClose={() => setAlertShowing(false)}>
                        To get started, create a new app or select an existing one. You can also check out our guides and resources to learn more about what you can do with Minus.
                    </Alert>
                    <Space h="xl" />
                </motion.div>
            </Section>

            <Section px="xl">
                <Grid gutter="xl">
                    <Grid.Col sm={12} md={9}>
                        <Stack spacing="lg">
                            <Group position="apart">
                                <Title order={2}>Your Apps</Title>
                                <GlassButton
                                    onClick={createApp}
                                    leftIcon={<TbPlus />} radius="xl" matchColor
                                >
                                    New App
                                </GlassButton>
                            </Group>

                            {apps == null ?
                                <Group position="center">
                                    <Loader size="sm" />
                                    <Text size="sm" color="dimmed">Loading apps</Text>
                                </Group> :
                                <>
                                    <SearchInput
                                        value={query}
                                        onChange={event => setQuery(event.currentTarget.value)}
                                        onClear={() => setQuery("")}
                                        noun="app"
                                        quantity={apps?.length}
                                    />

                                    {filteredApps.length == 0 ?
                                        <Text size="sm" color="dimmed" align="center">No apps found.</Text> :

                                        <SimpleGrid cols={2} breakpoints={[
                                            { maxWidth: "sm", cols: 1 },
                                        ]}>
                                            {filteredApps.map((app, i) =>
                                                <AppCard app={app} displayNameParts={filteredAppNames[i]} key={app.id} />
                                            )}
                                        </SimpleGrid>}
                                </>}
                        </Stack>
                    </Grid.Col>

                    <Grid.Col sm={12} md={3}>
                        <Stack>
                            <Title order={6}>Guides & Resource</Title>

                            <Text size="xs" align="center" color="dimmed">
                                Coming soon! Stayed tuned.
                            </Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Section>

            <Space h="10rem" />

            <Footer showCompanies={false} />
        </>
    )
}


function AppCard({ app, displayNameParts }) {

    const theme = useMantineTheme()
    const { flowCount } = useFlowCountForApp(app.id)

    const appUrl = `/app/${app.id}`

    // deleting an app
    const openDeleteModal = () => openContextModal({
        modal: "DeleteApp",
        title: "Delete " + app.name,
        innerProps: { appId: app.id },
    })

    // changing the color of an app
    const updateApp = useUpdateApp(app.id)
    const changeColor = color => {
        updateApp({ color })
    }

    // renaming an app
    const [renaming, setRenaming] = useState(false)
    const renameApp = useRenameApp(app.id)
    const rename = newName => {
        renameApp(newName)
        setRenaming(false)
    }

    // hover state
    const { hovered, ref: hoverRef } = useHover()

    // display name assembly
    const displayName = displayNameParts ?
        displayNameParts.map((part, i) => i % 2 == 0 ? part : <span className="text-yellow-900" key={i}>{part}</span>) :
        app.name

    const cardComponent = (
        <Card withBorder p={0} className="cursor-pointer shadow-xs" ref={hoverRef}>
            <Group spacing={0} align="stretch">
                <Box w="1.5rem" bg={app.color ?? theme.primaryColor} className="transition-colors" />

                <Stack spacing="0.1rem" p="sm" className="flex-1">
                    {renaming ?
                        <EditableText
                            highlight
                            initialValue={app.name}
                            onEdit={rename}
                            onCancel={() => setRenaming(false)}
                        /> :
                        <Text weight={500}>{displayName}</Text>}

                    <Text size="sm" color="dimmed">{flowCount || "No"} Workflows</Text>

                    <Group position="apart" className="translate-y-1">
                        <Menu withinPortal>
                            <Menu.Target>
                                <ActionIcon onClick={stopPropagation}>
                                    <TbDots />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown miw="10rem" onClick={stopPropagation}>
                                <SwatchArray
                                    colors={["pink", "yellow", "teal", "indigo"]}
                                    onChange={changeColor}
                                    value={app.color}
                                />
                                <Menu.Item icon={<TbArrowRight />} component={Link} href={appUrl}>
                                    Open
                                </Menu.Item>
                                <Menu.Item icon={<TbPencil />} onClick={() => setRenaming(true)}>
                                    Rename
                                </Menu.Item>
                                <Menu.Item icon={<TbTrash />} color="red" onClick={openDeleteModal}>
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                        <Button
                            radius="xl" size="xs" variant="subtle" compact
                            rightIcon={<TbArrowRight className={jc("transition-transform", hovered && !renaming && "translate-x-1")} />}
                        >
                            Open
                        </Button>
                    </Group>
                </Stack>
            </Group>
        </Card>
    )

    return renaming ?
        cardComponent :
        <Link href={appUrl}>
            {cardComponent}
        </Link>
}


function SwatchArray({ colors, shade = 5, onChange, value }) {

    const theme = useMantineTheme()

    return <Group spacing="xs" p="xs" position="center">
        {colors.map(color =>
            <ColorSwatch
                size="1rem"
                color={theme.colors[color][shade]}
                onClick={() => onChange?.(color)}
                className={jc(
                    "cursor-pointer hover:scale-125 active:scale-110 transition",
                    color == value && "scale-125 ring-2 ring-offset-2 ring-offset-white ring-gray-500"
                )}
                key={color}
            />
        )}
    </Group>
}