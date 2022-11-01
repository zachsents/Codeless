import { Badge, Box, Container, Group, Skeleton, Text, Title, Tooltip } from '@mantine/core'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import AppDashboard from '../../../components/AppDashboard'
import GradientBox from '../../../components/GradientBox'
import PageTitle from '../../../components/PageTitle'
import { firestore, useAsyncState, useMustBeSignedIn } from '../../../modules/firebase'


export default function AppOverview() {

    const user = useMustBeSignedIn()
    const { query: { appId }, pathname } = useRouter()

    const [, , app] = useAsyncState(async () => {
        return user && (await getDoc(
            doc(firestore, "users", user.uid, "apps", appId)
        )).data()
    }, [user])

    return (
        <AppDashboard>
            <GradientBox centerAround="blue">
                <Group position="apart" sx={{ alignItems: "stretch" }}>
                    <Box>
                        <PageTitle white mb={20}>{app?.name}</PageTitle>
                        <Text color="white" sx={{
                            minWidth: 300,
                            maxWidth: 500,
                        }}>
                            {app?.description ?? <>
                                <Skeleton height={8} radius="xl" />
                                <Skeleton height={8} mt={6} radius="xl" />
                                <Skeleton height={8} mt={6} width="70%" radius="xl" />
                            </>}
                        </Text>
                    </Box>
                    <Box>
                        <Badge size="xl">{app?.plan}</Badge>
                    </Box>
                </Group>
            </GradientBox>
        </AppDashboard>
    )
}

