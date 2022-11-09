import { Box, Button, Container, Group, Header, Menu, Skeleton, Tabs, Text } from "@mantine/core"
import { collection, query, where } from "firebase/firestore"
import { TbUserCircle } from "react-icons/tb"
import AppCard from "../components/AppCard"
import { firestore, mapSnapshot, signOut, useMustBeSignedIn } from "../modules/firebase"
import { useRealtimeState } from "../modules/hooks"


export default function Dashboard() {

    const user = useMustBeSignedIn()

    const [apps] = useRealtimeState(
        user && query(
            collection(firestore, "apps"),
            where("owner", "==", user.uid)
        ),
        mapSnapshot
    )

    return (
        <>
            <Header px={40} py={15}>
                <Group position="right">
                    <Menu withArrow position="bottom-end" width={200}>
                        <Menu.Target>
                            <Button variant="subtle" rightIcon={<TbUserCircle fontSize={30} />}>
                                <Text color="dimmed">{user?.displayName || user?.email}</Text>
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item onClick={() => signOut()}>Sign Out</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Header>
            <Container size="lg">
                <Tabs defaultValue="apps" styles={tabStyles} mt={40}>
                    <Tabs.List mb={30}>
                        <Tabs.Tab value="apps">Apps</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="apps" pt="xs">
                        <Box sx={gridStyle}>
                            {apps ?
                                apps.map(app => <AppCard app={app} key={app.id} />)
                                :
                                <>
                                    <Skeleton height={200} />
                                    <Skeleton height={200} />
                                    <Skeleton height={200} />
                                </>
                            }
                        </Box>
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </>
    )
}

const gridStyle = theme => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 30,
})

const tabStyles = theme => ({
    tabLabel: {
        fontSize: 18,
        fontWeight: 500,
    }
})