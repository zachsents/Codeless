import Link from "next/link"
import { ActionIcon, Box, Button, Group, SimpleGrid, Skeleton, Stack, Text, TextInput } from "@mantine/core"
import { TbExternalLink, TbPlus, TbArrowBigUpLines, TbX, TbSearch } from "react-icons/tb"
import { useAppDetailsRealtime, useFlowsForAppRealtime, usePlan } from "@minus/client-sdk"

import { useAppId, useMustBeSignedIn, useSearch } from "../../../modules/hooks"
import { plural } from "../../../modules/util"
import GlassButton from "../../../components/GlassButton"
import AppDashboard from "../../../components/AppDashboard"
import PageTitle from "../../../components/PageTitle"
import GradientBox from "../../../components/GradientBox"
import FlowCard from "../../../components/cards/FlowCard"


export default function AppFlows() {

    useMustBeSignedIn()
    const appId = useAppId()
    const [app] = useAppDetailsRealtime(appId)
    const { plan } = usePlan({ ref: app?.plan })
    const [flows] = useFlowsForAppRealtime(appId)

    const flowsLeft = plan?.flowCount - flows?.length

    const [filteredFlows, searchQuery, setSearchQuery] = useSearch(flows, flow => flow.name)

    return (
        <AppDashboard>
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

                <TextInput
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.currentTarget.value)}
                    radius="lg"
                    size="lg"
                    placeholder={`Search ${flows?.length ?? ""} flow${flows?.length == 1 ? "" : "s"}...`}
                    icon={<TbSearch />}
                    rightSection={searchQuery &&
                        <ActionIcon radius="md" mr="xl" onClick={() => setSearchQuery("")}>
                            <TbX />
                        </ActionIcon>
                    }
                />

                {filteredFlows?.length == 0 &&
                    <Text align="center" size="lg" color="dimmed">No flows found.</Text>}

                <SimpleGrid cols={2} spacing={35} verticalSpacing={25}>
                    {flows ?
                        filteredFlows?.map(flow => <FlowCard flow={flow} key={flow.id} />)
                        :
                        <>
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                            <Skeleton height={80} />
                        </>
                    }
                </SimpleGrid>
            </Stack>
        </AppDashboard>
    )
}
