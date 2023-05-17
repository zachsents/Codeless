import { Avatar, Center, Group, Loader, Menu, Text, useMantineTheme } from "@mantine/core"
import { motion } from "framer-motion"
import Brand from "./Brand"
import { NavLink } from "./NavLink"
import { useAuthState, useSignOut } from "@minus/client-sdk"
import { notifications } from "@mantine/notifications"
import { TbApps, TbLogout, TbUser } from "react-icons/tb"
import Link from "next/link"
import { useWindowScroll } from "@mantine/hooks"


export default function HeaderBase({ leftSection, rightSection, showCTA = true, slim = false }) {

    const theme = useMantineTheme()
    const [scroll] = useWindowScroll()

    const { user, isLoggedIn } = useAuthState()
    const [signOut, isSigningOut] = useSignOut({
        onSuccess: () => notifications.show({
            title: "You've been signed out!"
        })
    })

    return (
        <Center
            pos="sticky" top={0} className="z-50"
            p="0.5rem" bg="white"
            component={motion.header} variants={headerAnimations(theme)} initial="top" animate={scroll.y > 0 ? "scrolled" : "top"}
        >
            <Group maw={theme.other.contentWidth} position="apart" className="flex-1">
                <Group spacing="2.5rem">
                    <Brand {...(slim && {
                        variant: "gray",
                        size: "1.5rem",
                    })} />

                    {leftSection}
                </Group>

                <Group spacing="2rem">
                    {rightSection}

                    {isLoggedIn ?
                        <Group>
                            <Menu shadow="xs">
                                <Menu.Target>
                                    <Avatar src={user?.photoURL}
                                        color="" radius="xl" size={slim ? "2rem" : "md"}
                                        className="cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <TbUser size="1.25rem" />
                                    </Avatar>
                                </Menu.Target>

                                <Menu.Dropdown miw="10rem">
                                    <Text size="xs" weight={500} align="center" py="xs">
                                        Hey{user?.displayName ? ` ${user.displayName}` : ""}!
                                    </Text>
                                    <Menu.Item
                                        component={Link} href="/apps" icon={<TbApps />}
                                        color="violet" py="0.5rem"
                                    >
                                        <Text span weight={500}>Dashboard</Text>
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={signOut} icon={isSigningOut ? <Loader size="xs" /> : <TbLogout />}
                                        color={theme.other.halfDimmed} py="0.5rem"
                                    >
                                        Log Out</Menu.Item>
                                </Menu.Dropdown>
                            </Menu>

                            {showCTA &&
                                <NavLink href="/apps" button size={slim ? "xs" : "sm"}>
                                    Go to Minus
                                </NavLink>}
                        </Group> :

                        <Group>
                            <NavLink href="/login" button variant="subtle" size={slim ? "sm" : "md"}>
                                Sign in
                            </NavLink>

                            {showCTA &&
                                <NavLink href="/login?plan=free" button size={slim ? "xs" : "md"}>
                                    Start for free
                                </NavLink>}
                        </Group>}
                </Group>
            </Group>
        </Center>
    )
}

const headerAnimations = theme => ({
    top: {
        boxShadow: "none",
    },
    scrolled: {
        boxShadow: theme.shadows.xs,
    },
})

