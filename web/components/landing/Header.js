import { Divider, Group, Stack } from "@mantine/core"
import { NavLink } from "@web/components/NavLink"
import HeaderBase from "../HeaderBase"
import { notifications } from "@mantine/notifications"


export default function Header(props) {

    const showDocsNotif = () => notifications.show({
        title: "Coming soon!",
        message: "In the future, this link will take you to our documentation, where you'll find everything you need to know about using the platform."
    })

    return (
        <HeaderBase
            leftSection={<>
                <div className="hidden md:block">
                    <Group spacing="lg">
                        {/* <NavLink href="/team">Team</NavLink> */}
                        <NavLink href="/pricing">Pricing</NavLink>
                    </Group>
                </div>

                <div className="md:hidden">
                    <Divider mb="xl" />
                    <Stack spacing={0}>
                        {/* <NavLink href="/team" className={mobileNavLinkClass}>Team</NavLink> */}
                        <NavLink href="/pricing" className={mobileNavLinkClass}>Pricing</NavLink>
                    </Stack>
                </div>
            </>}
            rightSection={<>
                <div className="hidden md:block">
                    <Group spacing="lg">
                        <NavLink onClick={showDocsNotif} href="#docs">Docs</NavLink>
                    </Group>
                </div>

                <div className="md:hidden">
                    <Divider mb="xl" />
                    <Stack spacing={0}>
                        <NavLink onClick={showDocsNotif} href="#docs" className={mobileNavLinkClass}>Docs</NavLink>
                    </Stack>
                </div>
            </>}
            {...props}
        />
    )
}

const mobileNavLinkClass = "text-center hover:bg-gray-50 py-md rounded-md"
