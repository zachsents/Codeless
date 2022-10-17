import { ActionIcon, AppShell, Group, Navbar, NavLink, Title } from '@mantine/core'
import { FaHome } from "react-icons/fa"
import { TbReportAnalytics, TbSettings, TbDatabase } from "react-icons/tb"
import { TiFlowMerge } from "react-icons/ti"
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function AppBuilder({ children }) {

    const { query: { appId }, pathname } = useRouter()

    return (
        <AppShell
            padding="lg"
            styles={shellStyles}
            navbar={
                <Navbar width={{ base: 280 }} p="md">
                    <Navbar.Section>
                        <Group position="apart">
                            <Title order={3}>Codeless</Title>
                            <Link href="/dashboard">
                                <ActionIcon color="dark" component="a"><FaHome /></ActionIcon>
                            </Link>
                        </Group>
                    </Navbar.Section>
                    <Navbar.Section grow mt="md">
                        <Link href={`/app/${appId}`}>
                            <NavLink label="Overview" variant="filled" icon={<TbReportAnalytics />}
                                styles={navlinkStyles} component="a" active={pathname.endsWith("/[appId]")} />
                        </Link>
                        <Link href={`/app/${appId}/flows`}>
                            <NavLink label="Flows" variant="filled" icon={<TiFlowMerge />}
                                styles={navlinkStyles} component="a" active={pathname.endsWith("/flows")} />
                        </Link>
                        <Link href={`/app/${appId}/collections`}>
                            <NavLink label="Collections" variant="filled" icon={<TbDatabase />}
                                styles={navlinkStyles} component="a" active={pathname.endsWith("/collections")} />
                        </Link>
                        <Link href={`/app/${appId}/settings`}>
                            <NavLink label="Settings" variant="filled" icon={<TbSettings />}
                                styles={navlinkStyles} component="a" active={pathname.endsWith("/settings")} />
                        </Link>
                    </Navbar.Section>
                    <Navbar.Section>{/* Footer with user */}</Navbar.Section>
                </Navbar>}
        >
            {children}
        </AppShell>
    )
}

const shellStyles = theme => ({
    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
})

const navlinkStyles = theme => ({
    root: {
        borderRadius: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: 500,
    },
    icon: {
        fontSize: 18,
    },
})