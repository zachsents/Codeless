/* eslint-disable @next/next/no-img-element */
import { Box, Group, Space, Stack, Text } from "@mantine/core"
import Section from "../Section"
import WhiteLogo from "./WhiteLogo"
import { NavLink } from "./NavLink"


export default function Footer() {
    return (
        <Section component="footer" className="bg-primary" p="xl" sx={theme => ({
            boxShadow: `0 -1rem ${theme.colors.pink[6]}, 0 -1.5rem ${theme.colors.yellow[5]}`,
        })}>
            <Stack align="center" spacing="sm">
                <Text weight={500} color="white">Trusted by teams at</Text>
                <Group position="center" spacing="lg">
                    <img
                        src="/upfront_dist.avif" alt="Upfront Distribution logo"
                        loading="lazy" className="w-32"
                    />
                    <img
                        src="/virtue.png" alt="Virtue Marketing Group logo"
                        loading="lazy" className="w-32"
                    />
                </Group>
            </Stack>

            <Space h="3rem" />

            <Group position="apart" align="flex-end">
                <Stack spacing="xs">
                    <WhiteLogo />

                    <Group>
                        <NavLink href="/pricing" weight={500} size="sm" className="text-primary-300 hover:text-white">Pricing</NavLink>
                        <NavLink href="/team" weight={500} size="sm" className="text-primary-300 hover:text-white">Team</NavLink>
                        <NavLink href="/docs" weight={500} size="sm" className="text-primary-300 hover:text-white">Docs</NavLink>
                    </Group>
                </Stack>

                <Box>
                    <Text className="text-primary-200" size="sm">Questions, comments, suggestions?</Text>
                    <Text
                        component="a" color="white" size="sm" weight={600}
                        href="mailto:info@minuscode.app?subject=Minus%20Inquiry"
                    >
                        info@minuscode.app
                    </Text>
                </Box>
            </Group>
        </Section>
    )
}
