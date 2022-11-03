import { ActionIcon, Box, Button, Card, Center, Group, Loader, Menu, Modal, Text, Tooltip } from '@mantine/core'
import { deleteDoc, doc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { TbEdit, TbCopy, TbTrash, TbRun, TbFaceId, TbFaceIdError } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"
import { firestore } from '../modules/firebase'


export default function FlowCard({ flow }) {

    const { query: { appId } } = useRouter()

    const error = flow.status?.type == "error"
    const errorMessage = `${flow.status?.message ?? "Uh oh."} Click for more info`

    const [deleteModalOpened, setDeleteModalOpened] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const handleDelete = async () => {
        setDeleteLoading(true)
        await deleteDoc(doc(firestore, "apps", appId, "flows", flow.id))
        setDeleteModalOpened(false)
    }

    return (
        <>
            <Card shadow="xs" px={30} py="lg" mb={15} radius="md" withBorder sx={{ overflow: "visible" }}>
                <Group position="apart">
                    <Group spacing="xl">
                        {error ?
                            <Tooltip label={errorMessage} withArrow>
                                <ActionIcon variant="transparent" color="red"><TbFaceIdError fontSize={28} /></ActionIcon>
                            </Tooltip> :
                            <Tooltip label="Good to go!" withArrow>
                                <ActionIcon variant="transparent" color="gray"><TbFaceId fontSize={28} /></ActionIcon>
                            </Tooltip>}
                        <Box>
                            <Text size="lg" weight={600} mb={5}>{flow.name}</Text>
                            <Text color="dimmed">Trigger: Collection Item created</Text>
                        </Box>
                    </Group>
                    <Group spacing="xl">
                        <Tooltip label="Edit Flow" withArrow>
                            <div>
                                <Link href={`/app/${appId}/flow/${flow.id}/edit`}>
                                    <ActionIcon variant="transparent" color=""><TbEdit fontSize={28} /></ActionIcon>
                                </Link>
                            </div>
                        </Tooltip>
                        <Menu width={200}>
                            <Menu.Target>
                                <ActionIcon variant="transparent" color="dark"><TfiMoreAlt fontSize={20} /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item icon={<TbRun />}>View Runs</Menu.Item>
                                <Menu.Item icon={<TbCopy />}>Duplicate Flow</Menu.Item>
                                <Menu.Item onClick={() => setDeleteModalOpened(true)} icon={<TbTrash />} color="red">Delete Flow</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </Card>

            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title={`Deleting "${flow.name}"`}
            >
                <Text size="sm" mb={20} align="center">Are you sure?</Text>
                {deleteLoading ?
                    <Center><Loader size="sm" /></Center>
                    :
                    <Group position="apart">
                        <Button variant="outline" onClick={() => setDeleteModalOpened(false)}>Cancel</Button>
                        <Button color="red" rightIcon={<TbTrash />} onClick={handleDelete}>Positive.</Button>
                    </Group>
                }
            </Modal>
        </>
    )
}
