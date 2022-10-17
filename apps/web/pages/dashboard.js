import { Box, Container, Space, Tabs } from "@mantine/core"
import AppCard from "../components/AppCard"


export default function Dashboard() {
    return (
        <Container size="lg">
            <Tabs defaultValue="apps" styles={tabStyles} mt={40}>
                <Tabs.List mb={30}>
                    <Tabs.Tab value="apps">Apps</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="apps" pt="xs">
                    <Box sx={gridStyle}>
                        <AppCard />
                    </Box>
                </Tabs.Panel>
            </Tabs>
        </Container>
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