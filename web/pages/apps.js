import { Alert, Box, Button, Card, Grid, Group, Loader, SimpleGrid, Space, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { openContextModal } from "@mantine/modals"
import { useAppDetailsForUserRealtime, useFlowCountForApp } from "@minus/client-sdk"
import EditableText from "@web/components/EditableText"
import GlassButton from "@web/components/GlassButton"
import PageHead from "@web/components/PageHead"
import SearchInput from "@web/components/SearchInput"
import Section from "@web/components/Section"
import AppMenu from "@web/components/dashboard/AppMenu"
import Header from "@web/components/dashboard/Header"
import Footer from "@web/components/landing/Footer"
import { useAppRenaming, useMustBeSignedIn } from "@web/modules/hooks"
import { useSearch } from "@web/modules/search"
import { jc } from "@web/modules/util"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { TbArrowRight, TbPlus } from "react-icons/tb"


export default function AppsPage() {

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
            <PageHead title="Your Apps" />

            <Header />

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

    // renaming an app
    const { isRenaming, startRenaming, onRename, onCancel } = useAppRenaming(app.id)

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
                    {isRenaming ?
                        <EditableText
                            highlight
                            initialValue={app.name}
                            onEdit={onRename}
                            onCancel={onCancel}
                        /> :
                        <Text weight={500}>{displayName}</Text>}

                    <Text size="sm" color="dimmed">{flowCount || "No"} Workflow{flowCount == 1 ? "" : "s"}</Text>

                    <Group position="apart" className="translate-y-1">
                        <AppMenu app={app} startRename={startRenaming} />

                        <Button
                            radius="xl" size="xs" variant="subtle" compact
                            rightIcon={<TbArrowRight className={jc("transition-transform", hovered && !isRenaming && "translate-x-1")} />}
                        >
                            Open
                        </Button>
                    </Group>
                </Stack>
            </Group>
        </Card>
    )

    return isRenaming ?
        cardComponent :
        <Link href={`/app/${app.id}`}>
            {cardComponent}
        </Link>
}
