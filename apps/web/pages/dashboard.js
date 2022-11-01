import { ActionIcon, Box, Container, Group, Header, Menu, Tabs } from "@mantine/core"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useEffect } from "react"
import { TbUserCircle } from "react-icons/tb"
import AppCard from "../components/AppCard"
import { firestore, signOut, useAsyncState, useMustBeSignedIn } from "../modules/firebase"


export default function Dashboard() {

    const user = useMustBeSignedIn()

    const [,, apps] = useAsyncState(async () => {
        return user && (
            await getDocs(collection(firestore, "users", user.uid, "apps"))
        ).docs.map(doc => ({ id: doc.id, path: doc.ref.path, ...doc.data() }))
    }, [user])

    return (
        <>
            <Header px={40} py={15}>
                <Group position="right">
                    <Menu withArrow position="bottom-end" width={200}>
                        <Menu.Target>
                            <ActionIcon variant="transparent"><TbUserCircle fontSize={30} /></ActionIcon>
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
                            {apps?.map(app => <AppCard app={app} key={app.id} />)}
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
})

const tabStyles = theme => ({
    tabLabel: {
        fontSize: 18,
        fontWeight: 500,
    }
})