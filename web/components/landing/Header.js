import { Divider, Group, Stack } from "@mantine/core"
import { NavLink } from "@web/components/NavLink"
import HeaderBase from "../HeaderBase"


export default function Header(props) {

    return (
        <HeaderBase
            leftSection={<>
                <div className="hidden md:block">
                    <Group spacing="lg">
                        <NavLink href="/team">Team</NavLink>
                        <NavLink href="/pricing">Pricing</NavLink>
                    </Group>
                </div>

                <div className="md:hidden">
                    <Divider mb="xl" />
                    <Stack spacing={0}>
                        <NavLink href="/team" className={mobileNavLinkClass}>Team</NavLink>
                        <NavLink href="/pricing" className={mobileNavLinkClass}>Pricing</NavLink>
                    </Stack>
                </div>
            </>}
            rightSection={<>
                <div className="hidden md:block">
                    <Group spacing="lg">
                        <NavLink href="/docs">Docs</NavLink>
                    </Group>
                </div>

                <div className="md:hidden">
                    <Divider mb="xl" />
                    <Stack spacing={0}>
                        <NavLink href="/docs" className={mobileNavLinkClass}>Docs</NavLink>
                    </Stack>
                </div>
            </>}
            {...props}
        />
    )
}

const mobileNavLinkClass = "text-center hover:bg-gray-100 py-md rounded-md"
