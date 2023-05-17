import { Group } from "@mantine/core"
import { NavLink } from "@web/components/NavLink"
import HeaderBase from "../HeaderBase"


export default function Header(props) {
    return (
        <HeaderBase
            leftSection={
                <Group spacing="lg">
                    {/* <NavLink href="#">Integrations</NavLink> */}
                    <NavLink href="/team">Team</NavLink>
                    <NavLink href="/pricing">Pricing</NavLink>
                </Group>
            }
            rightSection={
                <Group spacing="lg">
                    <NavLink href="/docs">Docs</NavLink>
                </Group>
            }
            {...props}
        />
    )
}

