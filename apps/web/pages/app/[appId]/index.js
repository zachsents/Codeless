import { Badge, Box, Button, Card, Center, Group, Progress, RingProgress, SimpleGrid, Skeleton, Space, Text, Title, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import { TbArrowRight } from 'react-icons/tb'
import { Sparklines, SparklinesBars } from 'react-sparklines'
import AppDashboard from '../../../components/AppDashboard'
import GradientBox from '../../../components/GradientBox'
import LoadingSkeleton from '../../../components/LoadingSkeleton'
import PageTitle from '../../../components/PageTitle'
import OurCard from "../../../components/cards/OurCard"
import { useMustBeSignedIn } from '../../../modules/firebase'
import { useApp, useAppId, useCollectionCount, useFlowCount, usePlan } from "../../../modules/hooks"

export default function AppOverview() {

    const theme = useMantineTheme()

    useMustBeSignedIn()
    const appId = useAppId()
    const app = useApp()
    const plan = usePlan(app?.plan)

    const flowCount = useFlowCount(app?.id)
    const flowInfoLoaded = flowCount != null && !!plan

    const collectionCount = useCollectionCount(app?.id)
    const collectionInfoLoaded = collectionCount != null && !!plan

    return (
        <AppDashboard>
            <GradientBox>
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

            <SimpleGrid cols={2} spacing={50} verticalSpacing={50}>
                <OverviewCard
                    title="Flows"
                    plural="flows"
                    singular="flow"
                    href={`/app/${appId}/flows`}
                    color="indigo"
                    loaded={flowInfoLoaded}
                    count={flowCount}
                    planCount={plan?.flowCount}
                >
                    <Title order={4} align="center">Runs</Title>
                    <Text size="sm" color="dimmed" align="center">Last 30 days</Text>
                    <Space h={5} />
                    <Box sx={{ width: "100%" }} px={10}>
                        <Sparklines width={200} height={20} min={0} data={[2, 3, 3, 2, 15, 3, 5, 9, 6, 2, 2, 3, 2, 3, 3, 2, 15, 3, 5, 9, 6, 2, 2, 3, 7, 4, 5, 2, 4, 1]}>
                            <SparklinesBars style={{
                                fill: theme.colors.gray[4],
                                width: 2,
                            }} />
                        </Sparklines>
                    </Box>
                </OverviewCard>

                <OverviewCard
                    title="Collections"
                    plural="collections"
                    singular="collection"
                    href={`/app/${appId}/collections`}
                    color="cyan"
                    loaded={collectionInfoLoaded}
                    count={collectionCount}
                    planCount={plan?.collectionCount}
                >
                    <Title order={4} align="center">Reads & Writes</Title>
                    <Text size="sm" color="dimmed" align="center">Last 30 days</Text>
                    <Space h={5} />
                    <Box sx={{ width: "100%" }} px={10}>
                        <Sparklines width={200} height={20} min={0} data={[2, 3, 3, 2, 15, 3, 5, 9, 6, 2, 2, 3, 2, 3, 3, 2, 15, 3, 5, 9, 6, 2, 2, 3, 7, 4, 5, 2, 4, 1]}>
                            <SparklinesBars style={{
                                fill: theme.colors.gray[4],
                                width: 2,
                            }} />
                        </Sparklines>
                    </Box>
                </OverviewCard>
            </SimpleGrid>
        </AppDashboard>
    )
}


function OverviewCard({ children, title, href = "#", color = "indigo", loaded, count, planCount, singular, plural }) {
    return (
        <OurCard>
            <Group position="apart" mb={20}>
                <Title order={2}>{title}</Title>
                <Link href={href}>
                    <Button radius="xl" variant="subtle" color={color} rightIcon={<TbArrowRight />}>Go to {title}</Button>
                </Link>
            </Group>

            {loaded ?
                <Group position="apart" align="end" mb={10}>
                    <Text color={color} size="lg" weight={600}>{count} {count == 1 && singular ? singular : plural}</Text>
                    <Text color="dimmed">{planCount - count} remaining in your plan</Text>
                </Group>
                :
                <Group position="apart" mb={10}>
                    <Skeleton width={100} height={10} />
                    <Skeleton width={200} height={10} />
                </Group>}
            <Progress size="xl" radius="xl" color={color} value={loaded ? count / planCount * 100 : 0} />

            <Space h={30} />
            {children}
        </OurCard>
    )
}