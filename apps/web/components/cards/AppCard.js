import { ActionIcon, Badge, Box, Button, Card, Grid, Group, Indicator, Menu, Skeleton, Stack, Text, Title, Tooltip } from '@mantine/core'
import { useHover } from "@mantine/hooks"
import Link from 'next/link'
import { format as timeAgo } from 'timeago.js'
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa"
import ResourceFraction from '../ResourceFraction'
import { useCollectionCount, useFlowCount, usePlan } from "../../modules/hooks"
import { TbCrown, TbDots, TbTrophy } from 'react-icons/tb'


export default function AppCard({ app: { id, name, lastEdited, plan: planRef } }) {

    const flowCount = useFlowCount(id)
    const plan = usePlan(planRef)

    return (
        <Stack>
            <Indicator
                disabled={!plan}
                color={plan?.color}
                size={30}
                withBorder
                label={<TbCrown />}
            >
                <Link href={`/app/${id}`}>
                    <Box p="lg" sx={cardTitleContainerStyle}>
                        <Group position="apart">
                            <Text size={24} weight={500} color="white">{name}</Text>
                            <Box>
                                <Text size="sm" weight={500} align="right" color="white">{flowCount} flows</Text>
                                <Text size="sm" weight={500} align="right" color="white">3 integrations</Text>
                            </Box>
                        </Group>
                    </Box>
                </Link>
            </Indicator>

            <Grid px="md">
                <Grid.Col span="auto">
                    <Text size="xs" color="dimmed">Last edited {timeAgo(lastEdited.seconds * 1000)}</Text>
                </Grid.Col>

                <Grid.Col span="content">
                    <Menu position="bottom-end" shadow="lg" styles={{ dropdown: { border: "none" } }}>
                        <Menu.Target>
                            <ActionIcon color="gray" variant="light" radius="sm">
                                <TbDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                Rename
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Grid.Col>
            </Grid>
        </Stack>
    )
}

const cardTitleContainerStyle = theme => ({
    background: `linear-gradient(45deg, ${theme.colors.indigo[5]} 0%, ${theme.colors.cyan[5]} 100%)`,
    borderRadius: theme.radius.lg,
    cursor: "pointer",
    transition: "transform 0.15s",
    "&:hover": {
        transform: "scale(1.02)",
    },
})