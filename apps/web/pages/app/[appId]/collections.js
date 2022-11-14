import { Box, Button, Group, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core'
import Link from 'next/link'
import { useState } from 'react'
import { TbArrowBigUpLines, TbExternalLink, TbPlus } from 'react-icons/tb'
import AppDashboard from '../../../components/AppDashboard'
import CollectionCard from '../../../components/cards/CollectionCard'
import GlassButton from '../../../components/GlassButton'
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

    // duplication state & handlers
    const [creationPending, setCreationPending] = useState(false)
    const handleDuplicate = async () => {
        setCreationPending(true)
        console.log("TO DO: implement collection duplication with firebase function")
        // TO DO: create firebase function to do the duplication. Shouldn't
        // handle all of this client-side.
        setCreationPending(false)
    }

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
                                    <Link href={`/app/${app?.id}/collection/create`}>
                                        <Button
                                            component="a"
                                            variant="white"
                                            mt={15}
                                            leftIcon={<TbPlus />}
                                        >
                                            Create Collection
                                        </Button>
                                    </Link>
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
                            <GlassButton rightIcon={<TbExternalLink />}>Go to Guides</GlassButton>
                        </Stack>
                    </Box>
                </Group>
            </GradientBox>

            <SimpleGrid cols={3} spacing={30} verticalSpacing={30}>
                {collections ?
                    <>
                        {collections.map(collection =>
                            <CollectionCard collection={collection} onDuplicate={handleDuplicate} key={collection.id} />
                        )}
                        {creationPending && <Skeleton height={100} />}
                    </>
                    :
                    <>
                        <Skeleton height={100} />
                        <Skeleton height={100} />
                        <Skeleton height={100} />
                    </>
                }
            </SimpleGrid>
        </AppDashboard>
    )
}