import { Group, useMantineTheme } from "@mantine/core"
import HeaderBase from "../HeaderBase"
import { NavLink } from "../NavLink"
import { notifications } from "@mantine/notifications"


export default function Header() {

    const theme = useMantineTheme()

    const showDocsNotif = () => notifications.show({
        title: "Coming soon!",
        message: "In the future, this link will take you to our documentation, where you'll find everything you need to know about using the platform."
    })

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
                    <NavLink onClick={showDocsNotif} href="#docs" size="sm" color={theme.other.halfDimmed}>Docs</NavLink>
                    <NavLink onClick={showDocsNotif} href="#docs-nodes" size="sm" color={theme.other.halfDimmed}>Nodes</NavLink>
                    <NavLink onClick={showDocsNotif} href="#docs-guides" size="sm" color={theme.other.halfDimmed}>Guides</NavLink>
                </Group>
            }
        />
    )
}
