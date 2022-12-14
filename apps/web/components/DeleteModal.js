import { Button, Center, Group, Loader, Modal, Text } from '@mantine/core'
import { useState } from 'react'
import { TbTrash } from 'react-icons/tb'

export default function DeleteModal({ name, opened, setOpened, onDelete }) {

    const [deleteLoading, setDeleteLoading] = useState(false)
    const handleDelete = async () => {
        setDeleteLoading(true)
        await onDelete?.()
        setOpened(false)
    }

    return (
        <Modal
            centered
            opened={opened}
            onClose={() => setOpened(false)}
            title={`Delete "${name}"`}
            zIndex={1100}
        >
            <Text size="sm" mb={20} align="center">Are you sure?</Text>
            {deleteLoading ?
                <Center><Loader size="sm" /></Center>
                :
                <Group position="apart">
                    <Button variant="subtle" onClick={() => setOpened(false)}>Cancel</Button>
                    <Button color="red" rightIcon={<TbTrash />} onClick={handleDelete}>Positive.</Button>
                </Group>
            }
        </Modal>
    )
}
