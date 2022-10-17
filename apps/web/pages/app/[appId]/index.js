import { Badge, Box, Container, Group, Text, Title, Tooltip } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AppBuilder from '../../../components/AppBuilder'

export default function AppOverview() {

    const { query: { appId }, pathname } = useRouter()

    return (
        <AppBuilder>
            <Container size="lg" pt={50}>
                <Box p={40} sx={titleStyle}>
                    <Group position="apart" sx={{ alignItems: "stretch" }}> 
                        <Box>
                            <Title order={1} color="white" mb={20}>My First App</Title>
                            <Text color="white" sx={{ maxWidth: 500, }}>
                                This is the description text for my first app, which doesn't actually exist since this is
                                just a skeleton.
                            </Text>
                        </Box>
                        <Box>
                            <Badge size="xl">Basic</Badge>
                        </Box>
                    </Group>
                </Box>
            </Container>
        </AppBuilder>
    )
}

const titleStyle = theme => ({
    background: `linear-gradient(45deg, ${theme.colors.indigo[5]} 0%, ${theme.colors.cyan[5]} 100%)`,
    borderRadius: 10,
})