import { useEffect, useRef, useState } from 'react'
import { ActionIcon, Button, Group, TextInput, useMantineTheme } from '@mantine/core'
import produce from 'immer'
import { Reorder, useDragControls } from "framer-motion"
import { MenuOrder, Plus, X } from 'tabler-icons-react'
import { alphanumeric } from "nanoid-dictionary"
import { customAlphabet } from "nanoid"


export default function MultiInput({
    items,
    onChange,
    inputProps = {},
    buttonChildren,
    reorder = false,
    unique = false,
    validate,
}) {

    const theme = useMantineTheme()

    if (items === undefined) {
        var [uncontrolledItems, _setItems] = useState([])
        items = uncontrolledItems
    }

    const setItems = newItems => {
        _setItems?.(newItems)
        onChange?.(newItems)
    }

    const addItem = value => {
        setItems([
            ...items,
            { id: generateId(), value }
        ])
    }

    const onItemChange = (id, value) => {
        setItems(produce(items, draft => {
            draft.find(item => item.id == id).value = value
        }))
    }

    const setError = (id, err) => {
        setItems(produce(items, draft => {
            draft.find(item => item.id == id).error = err
        }))
    }

    const onRemove = id => {
        setItems(
            items.filter(item => item.id != id)
        )
    }

    const dragContainerRef = useRef()

    return (
        <Reorder.Group
            values={items}
            onReorder={setItems}
            ref={dragContainerRef}
            style={listStyle(theme)}
        >
            {items.map((item, i) =>
                <Item {...{
                    item, index: i, items, onChange: onItemChange, setError, onRemove,
                    inputProps, reorder, unique, validate, dragContainerRef,
                }} key={item.id} />
            )}

            <Button
                size="xs"
                compact
                variant="light"
                radius="xl"
                // fullWidth
                leftIcon={<Plus size={14} />}
                onClick={() => addItem("")}
            >
                {buttonChildren}
            </Button>
        </Reorder.Group>
    )
}


function Item({
    item, index, items, onChange, setError, onRemove,
    inputProps, reorder, unique, validate, dragContainerRef
}) {

    const controls = useDragControls()

    const handlePointerDown = event => {
        event.stopPropagation()
        controls.start(event)
    }

    const hasDuplicate = value => !!items.find((it, i) => it.value == value && i != index)

    useEffect(() => {
        if (unique) {
            const err = hasDuplicate(item.value) || validate?.(item.value)
            if (item.error != err)
                setError(item.id, err)
        }
    }, [items])

    return (
        <Reorder.Item
            value={item}
            dragListener={false}
            dragControls={controls}
            dragConstraints={dragContainerRef}
        >
            <Group spacing={5}>
                <TextInput
                    value={item.value}
                    onChange={event => onChange(item.id, event.currentTarget.value)}
                    sx={{ flexGrow: "1 !important", flexBasis: 0 }}
                    error={item.error}
                    {...inputProps}
                />

                {reorder &&
                    <ActionIcon onPointerDown={handlePointerDown}>
                        <MenuOrder size={14} />
                    </ActionIcon>}

                <ActionIcon
                    color="red"
                    onClick={() => onRemove(item.id)}
                >
                    <X size={14} />
                </ActionIcon>
            </Group>
        </Reorder.Item>
    )
}


const listStyle = theme => ({
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.xs,
    padding: 0,
})

const generateId = customAlphabet(alphanumeric, 10)