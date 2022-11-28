import { Button, Center, Group, Loader, Modal, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect, useRef, useState } from 'react'
import { TbCheck } from 'react-icons/tb'

export default function RenameModal({ name, opened, setOpened, onRename }) {

    const [renameLoading, setRenameLoading] = useState(false)
    const inputRef = useRef()

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

    // focus when modal opens
    useEffect(() => {
        opened && setTimeout(() => inputRef.current?.focus(), 100)   
    }, [opened])

    return (
        <Modal
            centered
            opened={opened}
            onClose={handleCancel}
            title={`Rename "${name}"`}
            zIndex={1100}
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                    placeholder="Enter a new name"
                    disabled={renameLoading}
                    {...form.getInputProps("newName")}
                    mb={20}
                    ref={inputRef}
                />
                {renameLoading ?
                    <Center><Loader size="sm" /></Center>
                    :
                    <Group position="apart">
                        <Button variant="subtle" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit" rightIcon={<TbCheck />}>Good to go</Button>
                    </Group>
                }
            </form>
        </Modal>
    )
}
