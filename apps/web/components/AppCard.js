import { ActionIcon, Badge, Box, Button, Card, Group, Skeleton, Text, Title, Tooltip } from '@mantine/core'
import Link from 'next/link'
import ResourceFraction from './ResourceFraction'
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa"
import { useHover } from "@mantine/hooks"
import { format as timeAgo } from 'timeago.js'
import { useCollectionCount, useFlowCount, usePlan } from '../modules/hooks'


export default function AppCard({ app: { id, name, lastEdited, plan: planRef } }) {

    const { hovered: showEditButton, ref: titleRef } = useHover()

    const flowCount = useFlowCount(id)
    const collectionCount = useCollectionCount(id)
    const plan = usePlan(planRef)

    return (
        <Card shadow="sm" p="lg" radius="lg">
            <Card.Section sx={cardTitleContainerStyle} ref={titleRef}>
                <Group position="apart" mr={20}>
                    <Title order={3} p={20} color="white">{name}</Title>
                    {showEditButton &&
                        <ActionIcon variant="transparent" sx={{ color: "white" }}><FaPencilAlt /></ActionIcon>}
                </Group>
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Text size="sm" color="dimmed">Last edited {timeAgo(lastEdited.seconds * 1000)}</Text>
                {plan ?
                    <Tooltip label="Change Plan" withArrow position="bottom">
                        <Box>
                            <Link href="#">
                                <Badge color={plan?.color} variant="light" component="a" sx={{ cursor: "pointer" }}>
                                    {plan?.name}
                                </Badge>
                            </Link>
                        </Box>
                    </Tooltip>
                    :
                    <Skeleton height={12} width={40} radius="xl" />
                }
            </Group>

            <Group position="center" spacing="xl" mb={30}>
                {flowCount && collectionCount && plan ?
                    <>
                        <ResourceFraction used={flowCount} total={plan?.flowCount} label="Flows" color="indigo" />
                        <ResourceFraction used={collectionCount} total={plan?.collectionCount} label="Collections" color="cyan" />
                    </>
                    :
                    <Skeleton height={12} width={100} mt={10} radius="xl" />
                }
            </Group>

            <Group>
                <Link href={`/app/${id}`}>
                    <Button variant="outline" component="a" sx={{ flexGrow: 1, }}>Open</Button>
                </Link>
                <Tooltip label="Delete App" withArrow>
                    <ActionIcon variant="transparent"><FaTrashAlt /></ActionIcon>
                </Tooltip>
            </Group>
        </Card>
    )
}

const cardTitleContainerStyle = theme => ({
    background: `linear-gradient(45deg, ${theme.colors.indigo[5]} 0%, ${theme.colors.cyan[5]} 100%)`
})