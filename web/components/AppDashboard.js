import { ActionIcon, AppShell, Button, Container, Group, Menu, Navbar, NavLink, ScrollArea, Title, Tooltip } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { TbBook, TbChevronDown, TbChevronLeft, TbCurrencyDollar, TbExternalLink, TbPlugConnected, TbReportAnalytics, TbSlideshow } from "react-icons/tb"
import { TiFlowMerge } from "react-icons/ti"

import { useAppContext } from "@web/modules/context"
import Head from "next/head"
import { useMustBeSignedIn } from "../modules/hooks"


export default function AppDashboard({ children, pageTitle }) {

    useMustBeSignedIn()

    const { app } = useAppContext()
    const { pathname } = useRouter()

    const dynamicPageTitle = `${pageTitle}${app?.name ? ` - ${app?.name}` : ""} | Minus`

    return (<>
        {pageTitle &&
            <Head>
                <title key="title">{dynamicPageTitle}</title>
                <meta property="og:title" content={dynamicPageTitle} key="ogtitle" />
            </Head>}
        <AppShell
            styles={shellStyles}
            navbar={
                <Navbar width={{ base: 280 }} withBorder={false} p="md">
                    <Navbar.Section>
                        <Group >
                            <Link href="/apps">
                                <Tooltip label="Back to Apps" position="right">
                                    <ActionIcon
                                        variant="light"
                                        size="lg"
                                    >
                                        <TbChevronLeft />
                                    </ActionIcon>
                                </Tooltip>
                            </Link>
                            <Menu width={200} shadow="sm" styles={{ dropdown: { border: "none" } }}>
                                <Menu.Target>
                                    <Button rightIcon={<TbChevronDown />} variant="light">
                                        <Title order={3}>minus</Title>
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item icon={<TbBook />} rightSection={<TbExternalLink />}>Guides</Menu.Item>
                                    <Menu.Item icon={<TbSlideshow />} rightSection={<TbExternalLink />}>Examples</Menu.Item>
                                    <Menu.Item icon={<TbCurrencyDollar />} rightSection={<TbExternalLink />}>Pricing</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Navbar.Section>
                    <Navbar.Section grow mt="md">
                        <Link href={`/app/${app?.id}`}>
                            <NavLink label="Overview" variant="filled" icon={<TbReportAnalytics />}
                                styles={navlinkStyles} active={pathname.endsWith("/[appId]")} />
                        </Link>
                        <Link href={`/app/${app?.id}/flows`}>
                            <NavLink label="Flows" variant="filled" icon={<TiFlowMerge />}
                                styles={navlinkStyles} active={pathname.endsWith("/flows")} />
                        </Link>
                        <Link href={`/app/${app?.id}/integrations`}>
                            <NavLink label="Integrations" variant="filled" icon={<TbPlugConnected />}
                                styles={navlinkStyles} active={pathname.endsWith("/integrations")} />
                        </Link>
                    </Navbar.Section>
                    <Navbar.Section>{/* Footer with user */}</Navbar.Section>
                </Navbar>}
        >
            <ScrollArea h="100vh">
                <Container size="lg" py={50}>
                    {children}
                </Container>
            </ScrollArea>
        </AppShell>
    </>)
}

const shellStyles = theme => ({
    main: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
})

const navlinkStyles = theme => ({
    root: {
        borderRadius: theme.radius.md,
    },
    label: {
        fontSize: 16,
        fontWeight: 500,
    },
    icon: {
        fontSize: 18,
    },
})