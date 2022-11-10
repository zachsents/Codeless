import { Button, Center, Group, Loader, Modal, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { TbCheck } from 'react-icons/tb'

export default function RenameModal({ name, opened, setOpened, onRename }) {

    const [renameLoading, setRenameLoading] = useState(false)

    const form = useForm({
        initialValues: {
            newName: "",
        },
        validate: {
            newName: value => !value,
        }
    })

    const handleSubmit = async values => {
        setRenameLoading(true)
        await onRename?.(values.newName)
        setOpened(false)
        setRenameLoading(false)
        form.setFieldValue("newName", "")
    }

    const handleCancel = () => {
        form.setFieldValue("newName", "")
        setOpened(false)
    }

    return (
        <Modal
            centered
            opened={opened}
            onClose={handleCancel}
            title={`Rename "${name}"`}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    placeholder="Enter a new name"
                    disabled={renameLoading}
                    {...form.getInputProps("newName")}
                    mb={20}
                />
                {renameLoading ?
                    <Center><Loader size="sm" /></Center>
                    :
                    <Group position="apart">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit" rightIcon={<TbCheck />}>Good to go</Button>
                    </Group>
                }
            </form>
        </Modal>
    )
}
