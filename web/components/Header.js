import { Center, Group, Text, useMantineTheme } from "@mantine/core"
import { useWindowScroll } from "@mantine/hooks"
import { motion } from "framer-motion"
import Link from "next/link"
import { NavLink } from "@web/components/landing/NavLink"


export default function Header() {

    const theme = useMantineTheme()
    const [scroll] = useWindowScroll()

    return (
        <Center
            pos="sticky" top={0} className="z-50"
            p="0.5rem" bg="white"
            component={motion.header} variants={headerAnimations(theme)} initial="top" animate={scroll.y > 0 ? "scrolled" : "top"}
        >
            <Group maw={theme.other.contentWidth} position="apart" className="flex-1">
                <Group spacing="2.5rem">
                    <Link href="/">
                        <Text size="2rem" weight={600} color={theme.fn.primaryColor()}>
                            <motion.span {...brandAnimations(theme)}>
                                minus
                            </motion.span>
                        </Text>
                    </Link>

                    <Group spacing="lg">
                        <NavLink href="#">Integrations</NavLink>
                        <NavLink href="/pricing">Pricing</NavLink>
                    </Group>
                </Group>

                <Group spacing="2rem">
                    <Group spacing="lg">
                        <NavLink href="#">Team</NavLink>
                        <NavLink href="#">Docs</NavLink>
                    </Group>
                    <Group>
                        <NavLink href="/login" button variant="subtle">Sign in</NavLink>
                        <NavLink href="/dashboard" button>Start for free</NavLink>
                    </Group>
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

const ShadowOffset = 0.06
const brandAnimations = theme => ({
    initial: {
        textShadow: "none"
    },
    whileHover: {
        textShadow: `${ShadowOffset}em ${ShadowOffset}em 0 ${theme.colors.pink[4]}, ${ShadowOffset * 2}em ${ShadowOffset * 2}em 0 ${theme.colors.yellow[4]}`
    },
})