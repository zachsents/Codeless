import { ActionIcon, Box, Card, Group, Menu, Text, Tooltip } from '@mantine/core'
import { deleteDoc, doc } from 'firebase/firestore'
import { useState } from 'react'
import { TbEdit, TbCopy, TbTrash, TbRun, TbArrowBigRight, TbEye } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"
import { firestore } from '../modules/firebase'
import { useAppId } from '../modules/hooks'
import DeleteModal from './DeleteModal'


export default function CollectionCard({ collection }) {

    const appId = useAppId()

    const [deleting, setDeleting] = useState(false)
    const handleDelete = () => deleteDoc(doc(firestore, "apps", appId, "collections", collection.id))

    return (
        <>
            <Card shadow="xs" px={30} py="lg" radius="md" withBorder sx={{ overflow: "visible" }}>
                <Group position="apart">
                    <Box>
                        <Text size="lg" weight={600} mb={5}>{collection.name}</Text>
                        <Text color="dimmed">{collection.itemCount} items</Text>
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
                                <Menu.Item onClick={() => setDeleting(true)} icon={<TbTrash />} color="red">Delete Collection</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </Card>

            <DeleteModal name={collection.name} opened={deleting} setOpened={setDeleting} onDelete={handleDelete} />
        </>
    )
}
