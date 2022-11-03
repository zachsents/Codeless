import { Box, Button, Group, Skeleton, Stack, Text } from '@mantine/core'
import AppDashboard from '../../../components/AppDashboard'
import PageTitle from '../../../components/PageTitle'
import FlowCard from '../../../components/FlowCard'
import GradientBox from '../../../components/GradientBox'
import { TbExternalLink, TbPlus, TbArrowBigUpLines } from "react-icons/tb"
import Link from 'next/link'
import { useApp, useAppId, useFlowsRealtime, usePlan } from '../../../modules/hooks'
import { useMustBeSignedIn } from '../../../modules/firebase'


export default function AppFlows() {

    useMustBeSignedIn()
    const appId = useAppId()
    const app = useApp()
    const plan = usePlan(app?.plan)
    const flows = useFlowsRealtime(appId)
    

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
                        {plan && flows ?
                            plan.flowCount > flows.length ?
                                <Link href={`/app/${app?.id}/flow/create`}>
                                    <Button
                                        component="a"
                                        variant="white"
                                        leftIcon={<TbPlus />}
                                        mt={20}
                                    >
                                        Create Flow
                                    </Button>
                                </Link>
                                :
                                <>
                                    <Text color="white" size="sm" mt={20}>With the <b>{plan.name}</b> plan, you can only make <b>{plan.flowCount}</b> flows.</Text>
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
                            <Button variant="white" rightIcon={<TbExternalLink />}>Go to Guides</Button>
                        </Stack>
                    </Box>
                </Group>
            </GradientBox>

            {flows ?
                flows?.map(flow => <FlowCard flow={flow} key={flow.id} />)
                :
                <Skeleton height={80} />
            }
        </AppDashboard>
    )
}
