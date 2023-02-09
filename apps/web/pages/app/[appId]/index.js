import Link from "next/link"
import { Avatar, Badge, Box, Button, Center, Group, Progress, SimpleGrid, Skeleton, Space, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import { Sparklines, SparklinesBars } from "react-sparklines"
import { TbArrowRight, TbBrandAirtable, TbBrandGmail, TbTrendingUp } from "react-icons/tb"
import { SiGooglesheets } from "react-icons/si"
import { useAppDetailsRealtime, useFlowCountForApp, usePlan } from "@minus/client-sdk"


import { useAppId, useMustBeSignedIn } from "../../../modules/hooks"
import AppDashboard from "../../../components/AppDashboard"
import GradientBox from "../../../components/GradientBox"
import LoadingSkeleton from "../../../components/LoadingSkeleton"
import PageTitle from "../../../components/PageTitle"
import OurCard from "../../../components/cards/OurCard"


export default function AppOverview() {

    const theme = useMantineTheme()

    useMustBeSignedIn()
    const appId = useAppId()
    const [app] = useAppDetailsRealtime(appId)
    const { plan } = usePlan({ ref: app?.plan })
    const { flowCount } = useFlowCountForApp(app?.id)
    const flowInfoLoaded = flowCount != null && !!plan

    return (
        <AppDashboard>
            <Stack spacing="xl">
                <GradientBox centerAround={app?.color ?? null}>
                    {app ?
                        <Group position="apart" sx={{ alignItems: "stretch" }}>
                            <Box>
                                <PageTitle white mb={20}>{app.name}</PageTitle>
                                <Text color="white" miw={300} max={500}>
                                    {app.description}
                                </Text>
                            </Box>
                            <Box>
                                {plan &&
                                    <Badge size="xl" color={plan?.color}>{plan?.name}</Badge>}
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
