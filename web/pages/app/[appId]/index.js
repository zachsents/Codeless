import {
    Avatar, Badge, Box, Button, Center, Group, Progress, SimpleGrid, Skeleton, Space, Stack, Text, Title,
    useMantineTheme
} from "@mantine/core"
import { Integrations } from "@minus/client-nodes"
import { useFlowCountForApp, usePlan, useUpdateApp } from "@minus/client-sdk"
import Link from "next/link"
import { TbArrowRight, TbTrendingUp } from "react-icons/tb"

import { AppProvider, useAppContext } from "@web/modules/context"
import AppDashboard from "../../../components/AppDashboard"
import AppDescriptionEditor from "../../../components/AppDescriptionEditor"
import GradientBox from "../../../components/GradientBox"
import LoadingSkeleton from "../../../components/LoadingSkeleton"
import PageTitle from "../../../components/PageTitle"
import OurCard from "../../../components/cards/OurCard"
import { useMustBeSignedIn } from "../../../modules/hooks"


const MAX_INTEGRATIONS_SHOWN = 5


export default function AppOverviewPage() {

    return <AppProvider redirectOnNotExist="/apps">
        <AppOverview />
    </AppProvider>
}

function AppOverview() {

    const theme = useMantineTheme()

    useMustBeSignedIn()

    const { app, integrations: appIntegrations } = useAppContext()

    const updateApp = useUpdateApp(app?.id)
    const { plan } = usePlan({ ref: app?.plan })
    const { flowCount } = useFlowCountForApp(app?.id)
    const flowInfoLoaded = flowCount != null && !!plan

    const integrations = Object.keys(appIntegrations).map(intId => Integrations[intId])
    const shown = integrations.slice(0, MAX_INTEGRATIONS_SHOWN)
    const overflow = integrations.length - MAX_INTEGRATIONS_SHOWN

    return (
        <AppDashboard pageTitle="Overview">
            <Stack spacing="xl">
                <GradientBox centerAround={app?.color ?? null}>
                    {app ?
                        <Group position="apart" sx={{ alignItems: "stretch" }}>
                            <Box>
                                <PageTitle white mb={20}>{app?.name}</PageTitle>
                                <AppDescriptionEditor description={app?.description} updateApp={updateApp} />
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
                                <Link href={`/app/${app?.id}/flows`}>
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
                                <Link href={`/app/${app?.id}/integrations`}>
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
                                {integrations.length || "No"} services integrated
                            </Text>

                            <Center>
                                <Avatar.Group>
                                    {shown.map(int =>
                                        <Avatar color={int.color} radius="xl" size="lg" key={int.id}>
                                            <int.icon /></Avatar>
                                    )}
                                    {overflow > 0 && <Avatar radius="xl" size="md">+{overflow}</Avatar>}
                                </Avatar.Group>
                            </Center>
                        </Stack>
                    </OurCard>
                </SimpleGrid>

            </Stack>
        </AppDashboard>
    )
}
