import { Box } from '@mantine/core'
import { useRouter } from 'next/router'
import GoBackButton from '../../../../components/GoBackButton'
import { useMustBeSignedIn } from '../../../../modules/firebase'

export default function CollectionOverview() {

    useMustBeSignedIn()

    const { query: { appId, collectionId } } = useRouter()

    return (
        <Box p={20}>
            <GoBackButton href={`/app/${appId}/collections`} noMargin />
        </Box>
    )
}
