import { Box, Button, Group, Stack, Text } from "@mantine/core"
import { useFlowsForAppRealtime, usePlan } from "@minus/client-sdk"
import Link from "next/link"
import { TbArrowBigUpLines, TbExternalLink, TbPlus } from "react-icons/tb"

import { AppProvider, useAppContext } from "@web/modules/context"
import AppDashboard from "../../../components/AppDashboard"
import GlassButton from "../../../components/GlassButton"
import GradientBox from "../../../components/GradientBox"
import PageTitle from "../../../components/PageTitle"
import Search from "../../../components/Search"
import FlowCard from "../../../components/cards/FlowCard"
import { useMustBeSignedIn } from "../../../modules/hooks"
import { plural } from "../../../modules/util"


export default function AppFlowsPage() {

    return <AppProvider redirectOnNotExist="/dashboard">
        <AppFlows />
    </AppProvider>
}

function AppFlows() {

    useMustBeSignedIn()

    const { app } = useAppContext()
    const { plan } = usePlan({ ref: app?.plan })
    const [flows] = useFlowsForAppRealtime(app?.id)

    const flowsLeft = plan?.flowCount - flows?.length

    return (
        <AppDashboard pageTitle="Flows">
            <Stack spacing="xl">
                <GradientBox centerAround={app?.color ?? null}>
                    <Group position="apart" sx={{ alignItems: "stretch" }}>
                        <Box sx={{ width: "60%", maxWidth: 500, minWidth: 250 }}>
                            <PageTitle white mb={20}>Flows</PageTitle>
                            <Text color="white">
                                Flows are blocks of logic that are triggered by different events. If you're having
                                trouble, check out the guides for a quick run-down.
                            </Text>
                            {plan && flows ?
                                plan.flowCount > flows.length ?
                                    <>
                                        <Text color="white" size="sm" mt={20}>You have <b>{flowsLeft}</b> flow{plural(flowsLeft)} left.</Text>
                                        <Link href={`/app/${app?.id}/flow/create`}>
                                            <Button
                                                component="a"
                                                variant="white"
                                                leftIcon={<TbPlus />}
                                                mt={15}
                                                radius="md"
                                            >
                                                Create Flow
                                            </Button>
                                        </Link>
                                    </>
                                    :
                                    <>
                                        <Text color="white" size="sm" mt={20}>With the <b>{plan.name}</b> plan, you can only make <b>{plan.flowCount}</b> flow{plural(plan.flowCount)}.</Text>
                                        <Button
                                            component="a"
                                            variant="white"
                                            rightIcon={<TbArrowBigUpLines />}
                                            mt={15}
                                        >Upgrade Plan</Button>
                                    </>
                                :
                                <></>
                            }
                        </Box>
                        <Box>
                            <Stack>
                                <GlassButton rightIcon={<TbExternalLink />}>Go to Guides</GlassButton>
                            </Stack>
                        </Box>
                    </Group>
                </GradientBox>

                <Search
                    list={flows}
                    selector={flow => flow.name}
                    noun="flow"
                    component={FlowCard}
                    componentItemProp="flow"
                />
            </Stack>
        </AppDashboard>
    )
}
