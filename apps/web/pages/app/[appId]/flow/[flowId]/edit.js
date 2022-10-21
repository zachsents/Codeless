import { Box, Group } from '@mantine/core'
import { useRouter } from 'next/router'
import GoBackButton from '../../../../../components/GoBackButton'

export default function EditFlow() {

    const { query: { appId, flowId } } = useRouter()

    return (
        <Box p={20}>
            <GoBackButton href={`/app/${appId}/flows`} noMargin />
        </Box>
    )
}
