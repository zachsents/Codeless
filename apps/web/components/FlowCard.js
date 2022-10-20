import { ActionIcon, Box, Card, Group, Menu, Text, Tooltip } from '@mantine/core'
import { TbEdit, TbCopy, TbTrash, TbRun, TbFaceId, TbFaceIdError } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"


export default function FlowCard({ error = false }) {
    return (
        <Card shadow="xs" px={30} py="lg" mb={15} radius="md" withBorder sx={{ overflow: "visible" }}>
            <Group position="apart">
                <Group spacing="xl">
                    {error ?
                        <Tooltip label="Uh oh. Click for more info" withArrow>
                            <ActionIcon variant="transparent" color="red"><TbFaceIdError fontSize={28} /></ActionIcon>
                        </Tooltip> :
                        <Tooltip label="Good to go!" withArrow>
                            <ActionIcon variant="transparent" color="gray"><TbFaceId fontSize={28} /></ActionIcon>
                        </Tooltip>}
                    <Box>
                        <Text size="lg" weight={600} mb={5}>Send email when user signs up</Text>
                        <Text color="dimmed">Trigger: Collection Item created</Text>
                    </Box>
                </Group>
                <Group spacing="xl">
                    <Tooltip label="Edit Flow" withArrow>
                        <ActionIcon variant="transparent" color=""><TbEdit fontSize={28} /></ActionIcon>
                    </Tooltip>
                    <Menu width={200}>
                        <Menu.Target>
                            <ActionIcon variant="transparent" color="dark"><TfiMoreAlt fontSize={20} /></ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item icon={<TbRun />}>View Runs</Menu.Item>
                            <Menu.Item icon={<TbCopy />}>Duplicate Flow</Menu.Item>
                            <Menu.Item icon={<TbTrash />} color="red">Delete Flow</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Group>
        </Card>
    )
}
