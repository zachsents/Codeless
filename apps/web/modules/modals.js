import { useEffect, useRef, useState } from 'react'
import { Button, Center, Group, Loader, Modal, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { openConfirmModal, openContextModal } from '@mantine/modals'
import { TbTrash, TbCheck } from 'react-icons/tb'



export function openDeleteModal(name, onDelete) {
    openConfirmModal({
        title: `Delete "${name}`,
        centered: true,
        children: (
            <Text size="sm" mb={20} align="center">Are you sure?</Text>
        ),
        groupProps: { position: "apart" },
        labels: { confirm: 'Positive.', cancel: 'Cancel' },
        confirmProps: { rightIcon: <TbTrash />, color: "red" },
        cancelProps: { variant: "subtle" },
        onConfirm: () => {
            onDelete?.()
        },
        onCancel: () => { },
    })
}


export function openRenameModal(name, onRename) {
    openContextModal({
        modal: "rename",
        title: `Rename "${name}"`,
        centered: true,
        innerProps: {
            name,
            onRename,
        },
    })
}


export default function RenameModal({ context, id, innerProps: { name, onRename } }) {

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
        context.closeModal(id)
        setRenameLoading(false)
        form.setFieldValue("newName", "")
    }

    const handleCancel = () => {
        form.setFieldValue("newName", "")
        context.closeModal(id)
    }

    // focus when modal opens
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100)
    }, [])

    return (
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
    )
}
