import { Avatar, Badge, Box, Button, Card, Center, Group, Progress, RingProgress, SimpleGrid, Skeleton, Space, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import { TbArrowRight, TbBrandAirtable, TbBrandGmail, TbTrendingUp } from 'react-icons/tb'
import { Sparklines, SparklinesBars } from 'react-sparklines'
import AppDashboard from '../../../components/AppDashboard'
import GradientBox from '../../../components/GradientBox'
import LoadingSkeleton from '../../../components/LoadingSkeleton'
import PageTitle from '../../../components/PageTitle'
import OurCard from "../../../components/cards/OurCard"
import { useMustBeSignedIn } from '../../../modules/firebase'
import { useApp, useAppId, useCollectionCount, useFlowCount, usePlan } from "../../../modules/hooks"
import { SiGooglesheets } from 'react-icons/si'

export default function AppOverview() {

    const theme = useMantineTheme()

    useMustBeSignedIn()
    const appId = useAppId()
    const app = useApp()
    const plan = usePlan(app?.plan)

    const flowCount = useFlowCount(app?.id)
    const flowInfoLoaded = flowCount != null && !!plan

    // const collectionCount = useCollectionCount(app?.id)
    // const collectionInfoLoaded = collectionCount != null && !!plan

    return (
        <AppDashboard>
            <Stack spacing="xl">
                <GradientBox centerAround={app?.color ?? null}>
                    {app && plan ?
                        <Group position="apart" sx={{ alignItems: "stretch" }}>
                            <Box>
                                <PageTitle white mb={20}>{app.name}</PageTitle>
                                <Text color="white" sx={{
                                    minWidth: 300,
                                    maxWidth: 500,
                                }}>
                                    {app.description}
                                </Text>
                            </Box>
                            <Box>
                                <Badge size="xl" color={plan?.color}>{plan?.name}</Badge>
                            </Box>
                        </Group>
                        :
                        <LoadingSkeleton />
                    }
                </GradientBox>

                <SimpleGrid cols={2} spacing="xl" verticalSpacing="xl">

                    {/* Flows Overview */}
                    <OurCard>
                        <Stack>
                            <Group position="apart">
                                <Title order={2}>Flows</Title>
                                <Link href={`/app/${appId}/flows`}>
                                    <Button
                                        radius="xl"
                                        variant="subtle"
                                        rightIcon={<TbArrowRight />}
                                    >
                                        Go to Flows
                                    </Button>
                                </Link>
                            </Group>

                            <Box>
                                {flowInfoLoaded ?
                                    <Group position="apart" align="end">
                                        <Text
                                            color={theme.primaryColor}
                                            size="lg"
                                            weight={600}
                                        >
                                            {flowCount} flow{flowCount == 1 ? "" : "s"}
                                        </Text>
                                        <Text color="dimmed">{plan?.flowCount - flowCount} remaining in your plan</Text>
                                    </Group>
                                    :
                                    <Group position="apart">
                                        <Skeleton width={100} height={10} />
                                        <Skeleton width={200} height={10} />
                                    </Group>}
                                <Space h="xs" />
                                <Progress
                                    size="xl"
                                    radius="xl"
                                    value={flowInfoLoaded ? flowCount / plan?.flowCount * 100 : 0}
                                />
                            </Box>

                            <Center>
                                <Link href="#">
                                    <Button
                                        variant="subtle"
                                        leftIcon={<TbTrendingUp />}
                                    >
                                        Upgrade your plan
                                    </Button>
                                </Link>
                            </Center>
                        </Stack>
                    </OurCard>

                    {/* Integrations Overview */}
                    <OurCard>
                        <Stack>
                            <Group position="apart">
                                <Title order={2}>Integrations</Title>
                                <Link href={`/app/${appId}/integrations`}>
                                    <Button
                                        radius="xl"
                                        variant="subtle"
                                        rightIcon={<TbArrowRight />}
                                    >
                                        Go to Integrations
                                    </Button>
                                </Link>
                            </Group>

                            <Text
                                color={theme.primaryColor}
                                size="lg"
                                weight={600}
                            >
                                5 services integrated
                            </Text>

                            <Center>
                                <Avatar.Group>
                                    <Avatar color="red" radius="xl" size="lg"><TbBrandGmail /></Avatar>
                                    <Avatar color="green" radius="xl" size="lg"><SiGooglesheets /></Avatar>
                                    <Avatar color="yellow" radius="xl" size="lg"><TbBrandAirtable /></Avatar>
                                    <Avatar radius="xl" size="md">+2</Avatar>
                                </Avatar.Group>
                            </Center>
                        </Stack>
                    </OurCard>
                </SimpleGrid>

            </Stack>
        </AppDashboard>
    )
}
