import { Badge, Box, Group, Skeleton, Text } from '@mantine/core'
import AppDashboard from '../../../components/AppDashboard'
import GradientBox from '../../../components/GradientBox'
import LoadingSkeleton from '../../../components/LoadingSkeleton'
import PageTitle from '../../../components/PageTitle'
import { useMustBeSignedIn } from '../../../modules/firebase'
import { useApp, usePlan } from "../../../modules/hooks"

export default function AppOverview() {

    useMustBeSignedIn()
    const app = useApp()
    const plan = usePlan(app?.plan)

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
                            <Badge size="xl" color={plan?.color} sx={badgeStyle}>{plan?.name}</Badge>
                        </Box>
                    </Group>
                    :
                    <LoadingSkeleton />
                }
            </GradientBox>
        </AppDashboard>
    )
}

const badgeStyle = theme => ({
    // backgroundColor: "white",
})