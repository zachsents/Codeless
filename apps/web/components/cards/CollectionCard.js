import { ActionIcon, Box, Group, Menu, Stack, Text, Tooltip } from '@mantine/core'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useState } from 'react'
import { TbCopy, TbTrash, TbEye, TbPencil } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"
import { firestore } from '../../modules/firebase'
import { useAppId } from '../../modules/hooks'
import { openDeleteModal, openRenameModal } from '../../modules/modals'
import FloatingMenu from '../FloatingMenu'
import OurCard from "./OurCard"


export default function CollectionCard({ collection, onDuplicate }) {

    const appId = useAppId()

    const handleDelete = () => deleteDoc(doc(firestore, "apps", appId, "collections", collection.id))

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
                                <Menu.Item
                                    icon={<TbPencil />}
                                    onClick={() => openRenameModal(collection.name, handleRename)}
                                >
                                    Rename Collection
                                </Menu.Item>
                                <Menu.Item
                                    disabled
                                    icon={<TbCopy />}
                                    onClick={() => onDuplicate?.()}
                                >
                                    Duplicate Collection
                                </Menu.Item>
                                <Menu.Item
                                    color="red"
                                    icon={<TbTrash />}
                                    onClick={() => openDeleteModal(collection.name, handleDelete)}
                                >
                                    Delete Collection
                                </Menu.Item>
                            </Menu.Dropdown>
                        </FloatingMenu>
                    </Group>
                </Stack>
            </OurCard>
        </>
    )
}
