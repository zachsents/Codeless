import { Group, useMantineTheme } from "@mantine/core"
import HeaderBase from "../HeaderBase"
import { NavLink } from "../NavLink"


export default function Header() {

    const theme = useMantineTheme()

    return (
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
    )
}
