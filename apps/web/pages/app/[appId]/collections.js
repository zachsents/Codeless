import { Box, Button, Group, Stack, Text } from '@mantine/core'
import { collection } from 'firebase/firestore'
import { TbExternalLink, TbPlus } from 'react-icons/tb'
import AppDashboard from '../../../components/AppDashboard'
import CollectionCard from '../../../components/CollectionCard'
import GradientBox from '../../../components/GradientBox'
import PageTitle from '../../../components/PageTitle'
import { firestore, getMappedDocs, useMustBeSignedIn } from '../../../modules/firebase'
import { useApp, useAsyncState } from '../../../modules/hooks'


export default function AppCollections() {

    useMustBeSignedIn()
    const app = useApp()

    const [collections] = useAsyncState(async () => {
        return app && await getMappedDocs(collection(firestore, "apps", app.id, "collections"))
    }, [app])

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
                        <Button variant="white" mt={20} leftIcon={<TbPlus />}>Create Collection</Button>
                    </Box>
                    <Box>
                        <Stack>
                            <Button variant="white" rightIcon={<TbExternalLink />}>Go to Guides</Button>
                        </Stack>
                    </Box>
                </Group>
            </GradientBox>

            <Box sx={gridStyle}>
                {collections?.map(collection => <CollectionCard collection={collection} key={collection.id} />)}
            </Box>
        </AppDashboard>
    )
}

const gridStyle = theme => ({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 30,
})