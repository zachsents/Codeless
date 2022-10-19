import { Box, Button, Container, Group, Stack, Text } from '@mantine/core'
import AppDashboard from '../../../components/AppDashboard'
import PageTitle from '../../../components/PageTitle'
import FlowCard from '../../../components/FlowCard'
import GradientBox from '../../../components/GradientBox'
import { TbExternalLink } from "react-icons/tb"

export default function AppFlows() {
    return (
        <AppDashboard>
            <Container size="lg" pt={50}>
                <GradientBox>
                    <Group position="apart" sx={{ alignItems: "stretch" }}>
                        <Box>
                            <PageTitle white mb={20}>Flows</PageTitle>
                            <Text color="white" sx={{
                                maxWidth: 500
                            }}>
                                Flows are blocks of logic that are triggered by different events. If you're having
                                trouble, check out the guides for a quick run-down.
                            </Text>
                        </Box>
                        <Box>
                            <Stack>
                                <Button variant="white" rightIcon={<TbExternalLink />}>Go to Guides</Button>
                            </Stack>
                        </Box>
                    </Group>
                </GradientBox>
                <FlowCard />
                <FlowCard />
                <FlowCard />
                <FlowCard />
                <FlowCard />
                <FlowCard />
                <FlowCard />
                <FlowCard />
                <FlowCard />
            </Container>
        </AppDashboard>
    )
}
