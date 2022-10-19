import { Badge, Box, Container, Group, Text, Title, Tooltip } from '@mantine/core'
import { useRouter } from 'next/router'
import AppDashboard from '../../../components/AppDashboard'
import GradientBox from '../../../components/GradientBox'
import PageTitle from '../../../components/PageTitle'


export default function AppOverview() {

    const { query: { appId }, pathname } = useRouter()

    return (
        <AppDashboard>
            <Container size="lg" pt={50}>
                <GradientBox centerAround="blue">
                    <Group position="apart" sx={{ alignItems: "stretch" }}>
                        <Box>
                            <PageTitle white mb={20}>My First App</PageTitle>
                            <Text color="white" sx={{
                                maxWidth: 500
                            }}>
                                This is the description text for my first app, which doesn't actually exist since this is
                                just a skeleton.
                            </Text>
                        </Box>
                        <Box>
                            <Badge size="xl">Basic</Badge>
                        </Box>
                    </Group>
                </GradientBox>
            </Container>
        </AppDashboard>
    )
}

