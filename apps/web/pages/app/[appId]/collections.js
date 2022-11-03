import { Box, Button, Group, Skeleton, Stack, Text } from '@mantine/core'
import { TbArrowBigUpLines, TbExternalLink, TbPlus } from 'react-icons/tb'
import AppDashboard from '../../../components/AppDashboard'
import CollectionCard from '../../../components/CollectionCard'
import GradientBox from '../../../components/GradientBox'
import PageTitle from '../../../components/PageTitle'
import { useMustBeSignedIn } from '../../../modules/firebase'
import { useApp, useAppId, useCollectionsRealtime, usePlan } from '../../../modules/hooks'
import { plural } from "../../../modules/util"


export default function AppCollections() {

    useMustBeSignedIn()
    const appId = useAppId()
    const app = useApp()
    const plan = usePlan(app?.plan)
    const collections = useCollectionsRealtime(appId)

    const collectionsLeft = plan?.collectionCount - collections?.length

    return (
        <AppDashboard>
            <GradientBox>
                <Group position="apart" sx={{ alignItems: "stretch" }}>
                    <Box sx={{ width: "60%", maxWidth: 500, minWidth: 250 }}>
                        <PageTitle white mb={20}>Collections</PageTitle>
                        <Text color="white">
                            Collections are where you keep your app's data. Use collections to store data from flows
                            or to trigger flows. If you're having trouble, check out the guides for a quick run-down.
                        </Text>
                        {plan && collections ?
                            plan.collectionCount > collections.length ?
                                <>
                                    <Text color="white" size="sm" mt={20}>You have <b>{collectionsLeft}</b> collection{plural(collectionsLeft)} left.</Text>
                                    <Button variant="white" mt={15} leftIcon={<TbPlus />}>Create Collection</Button>
                                </>
                                :
                                <>
                                    <Text color="white" size="sm" mt={20}>With the <b>{plan.name}</b> plan, you can only make <b>{plan.collectionCount}</b> collection{plural(plan.collectionCount)}.</Text>
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

            <Box sx={gridStyle}>
                {collections ?
                    collections.map(collection => <CollectionCard collection={collection} key={collection.id} />)
                    :
                    <>
                        <Skeleton height={100} />
                        <Skeleton height={100} />
                        <Skeleton height={100} />
                    </>
                }
            </Box>
        </AppDashboard>
    )
}

const gridStyle = theme => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 30,
})
