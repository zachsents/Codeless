import { ActionIcon, Box, Group, Menu, Stack, Text, Tooltip } from '@mantine/core'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useState } from 'react'
import { TbCopy, TbTrash, TbEye, TbPencil } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"
import { firestore } from '../../modules/firebase'
import { useAppId } from '../../modules/hooks'
import DeleteModal from '../DeleteModal'
import FloatingMenu from '../FloatingMenu'
import RenameModal from '../RenameModal'
import OurCard from "./OurCard"


export default function CollectionCard({ collection, onDuplicate }) {

    const appId = useAppId()

    // deleting state & handlers
    const [deleting, setDeleting] = useState(false)
    const handleDelete = () => deleteDoc(doc(firestore, "apps", appId, "collections", collection.id))

    // renaming state & handlers
    const [renaming, setRenaming] = useState(false)
    const handleRename = newName => updateDoc(
        doc(firestore, "apps", appId, "collections", collection.id),
        { name: newName }
    )

    return (
        <>
            <OurCard>
                <Stack justify="space-between" sx={{ height: "100%" }}>
                    <Box>
                        <Text size="lg" weight={600} mb={5}>{collection.name}</Text>
                        <Text color="dimmed">{collection.itemCount} items</Text>
                    </Box>
                    <Group spacing="xl" position="right">
                        <Tooltip label="View Collection" withArrow>
                            <div>
                                <Link href={`/app/${appId}/collection/${collection.id}`}>
                                    <ActionIcon component="a" variant="transparent" color="dark"><TbEye fontSize={28} /></ActionIcon>
                                </Link>
                            </div>
                        </Tooltip>
                        <FloatingMenu>
                            <Menu.Target>
                                <ActionIcon variant="transparent" color="dark"><TfiMoreAlt fontSize={20} /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => setRenaming(true)} icon={<TbPencil />}>Rename Collection</Menu.Item>
                                <Menu.Item disabled onClick={() => onDuplicate?.()} icon={<TbCopy />}>Duplicate Collection</Menu.Item>
                                <Menu.Item onClick={() => setDeleting(true)} icon={<TbTrash />} color="red">Delete Collection</Menu.Item>
                            </Menu.Dropdown>
                        </FloatingMenu>
                    </Group>
                </Stack>
            </OurCard>

            <DeleteModal name={collection.name} opened={deleting} setOpened={setDeleting} onDelete={handleDelete} />
            <RenameModal name={collection.name} opened={renaming} setOpened={setRenaming} onRename={handleRename} />
        </>
    )
}
