import { ActionIcon, Box, Card, Group, Menu, Text, Tooltip } from '@mantine/core'
import { TbEdit, TbCopy, TbTrash, TbRun, TbArrowBigRight, TbEye } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"


export default function CollectionCard() {
    return (
        <Card shadow="xs" px={30} py="lg" radius="md" withBorder sx={{ overflow: "visible" }}>
            <Group position="apart">
                <Box>
                    <Text size="lg" weight={600} mb={5}>Leads</Text>
                    <Text color="dimmed">482 items</Text>
                </Box>
                <Group spacing="xl">
                    <Tooltip label="View Collection" withArrow>
                        <ActionIcon variant="transparent" color=""><TbEye fontSize={28} /></ActionIcon>
                    </Tooltip>
                    <Menu width={200}>
                        <Menu.Target>
                            <ActionIcon variant="transparent" color="dark"><TfiMoreAlt fontSize={20} /></ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item icon={<TbCopy />}>Duplicate Collection</Menu.Item>
                            <Menu.Item icon={<TbTrash />} color="red">Delete Collection</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Group>
        </Card>
    )
}
