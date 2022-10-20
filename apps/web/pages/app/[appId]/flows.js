import { Box, Button, Container, Group, Stack, Text } from '@mantine/core'
import AppDashboard from '../../../components/AppDashboard'
import PageTitle from '../../../components/PageTitle'
import FlowCard from '../../../components/FlowCard'
import GradientBox from '../../../components/GradientBox'
import { TbExternalLink, TbPlus } from "react-icons/tb"
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function AppFlows() {

    const { query: { appId } } = useRouter()

    return (
        <AppDashboard>
            <GradientBox>
                <Group position="apart" sx={{ alignItems: "stretch" }}>
                    <Box sx={{ width: "60%", maxWidth: 500, minWidth: 250 }}>
                        <PageTitle white mb={20}>Flows</PageTitle>
                        <Text color="white">
                            Flows are blocks of logic that are triggered by different events. If you're having
                            trouble, check out the guides for a quick run-down.
                        </Text>
                        <Link href={`/app/${appId}/flow/create`}>
                            <Button
                                component="a"
                                variant="white"
                                leftIcon={<TbPlus />}
                                mt={20}
                            >
                                Create Flow
                            </Button>
                        </Link>
                    </Box>
                    <Box>
                        <Stack>
                            <Button variant="white" rightIcon={<TbExternalLink />}>Go to Guides</Button>
                        </Stack>
                    </Box>
                </Group>
            </GradientBox>

            <FlowCard />
            <FlowCard error />
            <FlowCard />
            <FlowCard />
            <FlowCard />
            <FlowCard />
            <FlowCard />
            <FlowCard />
            <FlowCard />
        </AppDashboard>
    )
}
