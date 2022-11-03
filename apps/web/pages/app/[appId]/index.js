import { Badge, Box, Group, Skeleton, Text } from '@mantine/core'
import AppDashboard from '../../../components/AppDashboard'
import GradientBox from '../../../components/GradientBox'
import LoadingSkeleton from '../../../components/LoadingSkeleton'
import PageTitle from '../../../components/PageTitle'
import { useMustBeSignedIn } from '../../../modules/firebase'
import { useApp } from "../../../modules/hooks"

export default function AppOverview() {

    useMustBeSignedIn()
    const app = useApp()

    return (
        <AppDashboard>
            <GradientBox centerAround="blue">
                {app ?
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
                            <Badge size="xl">{app.plan}</Badge>
                        </Box>
                    </Group>
                    :
                    <LoadingSkeleton />
                }
            </GradientBox>
        </AppDashboard>
    )
}

