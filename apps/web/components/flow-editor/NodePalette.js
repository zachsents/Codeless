import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ActionIcon, Badge, Button, Group, HoverCard, Stack, Text, Title, UnstyledButton, useMantineTheme } from "@mantine/core"
import { Square } from "tabler-icons-react"

import { addNodeAtCenter, addNodesAtCenter } from "@web/modules/graph-util"
import Search from "../Search"
import { useSetState } from "@mantine/hooks"
import { TbArrowRight, TbCheck, TbMinus, TbPlus } from "react-icons/tb"
import { CreatableNodeDefinitions } from "@minus/client-nodes"
import styles from "./NodePalette.module.css"


const NodeList = Object.values(CreatableNodeDefinitions)


export default function NodePalette({ context, id, innerProps: { rf, suggestions, onAdd } }) {

    // adding nodes
    const handleAddNode = type => {
        if (onAdd)
            onAdd(type)
        else
            addNodeAtCenter(rf, type.id)
        context.closeModal(id)
    }

    // checkbox adding
    const [nodeCart, setNodeCart] = useSetState({})
    const cartTotal = useMemo(() => Object.values(nodeCart).reduce((sum, cur) => sum + cur, 0), [nodeCart])
    const finishCart = () => {
        addNodesAtCenter(rf,
            Object.entries(nodeCart).flatMap(([typeId, quantity]) => Array(quantity).fill(typeId))
        )
        context.closeModal(id)
    }

    // moving focus with arrow keys
    const numColumnsRef = useRef(2)
    const searchRef = useRef()
    const gridRef = useRef()

    const searchKeyHandler = useCallback(event => {
        if (event.key == "ArrowDown")
            gridRef.current.querySelector("button")?.focus()
    }, [gridRef.current])

    const gridKeyHandler = useCallback(event => {
        const focused = gridRef.current.querySelector("button:focus")

        switch (event.key) {
            case "ArrowRight":
                focused?.nextSibling?.focus()
                break
            case "ArrowLeft":
                focused?.previousSibling?.focus()
                break
            case "ArrowUp":
                // eslint-disable-next-line no-case-declarations
                const nextEl = Array(numColumnsRef.current).fill(0).reduce(el => el?.previousSibling, focused)
                if (nextEl)
                    nextEl.focus()
                else {
                    searchRef.current?.focus()
                    goToEndOfInput(searchRef.current)
                }
                break
            case "ArrowDown":
                Array(numColumnsRef.current).fill(0).reduce(el => el?.nextSibling, focused)?.focus()
                break
            case "Enter":
            case "Tab":
                break
            default:
                searchRef.current?.focus()
                goToEndOfInput(searchRef.current)
                break
        }
    }, [gridRef.current, searchRef.current, numColumnsRef.current])

    // show suggestions in separate section
    const suggestedSearchLists = useMemo(() => {
        if (!suggestions)
            return null

        const otherNodes = []
        const suggestedNodes = NodeList.filter(
            node => suggestions.includes(node.id) || (otherNodes.push(node), false)
        )

        return [
            { name: "Suggested", list: suggestedNodes },
            { name: "Other Nodes", list: otherNodes },
        ]
    }, [suggestions])

    return (
        <Stack>
            <Search
                list={suggestedSearchLists ?? NodeList}
                selector={type => type.name + (type.badge ?? "") + type.description}
                noun="node"
                component={NodeTile}
                componentItemProp="type"
                componentProps={(type, i, { query }) => ({
                    onClick: () => handleAddNode(type),
                    quantity: nodeCart[type.id] ?? 0,
                    onQuantityChange: newQuantity => setNodeCart({ [type.id]: newQuantity }),
                    expanded: !!query,
                })}
                gridProps={({ query }) => {
                    numColumnsRef.current = query ? 1 : 2
                    return {
                        cols: numColumnsRef.current,
                        spacing: "sm",
                        onKeyDown: gridKeyHandler,
                    }
                }}
                gridRef={gridRef}
                inputProps={{ onKeyDown: searchKeyHandler }}
                inputRef={searchRef}
                rightSection={cartTotal > 0 &&
                    <Button onClick={finishCart} rightIcon={<TbArrowRight />}>Add {cartTotal} Nodes</Button>}
            />
        </Stack>
    )
}


const NodeTile = forwardRef(({ type, expanded, quantity, onQuantityChange, ...props }, ref) => {

    const Icon = type.icon ?? Square

    const theme = useMantineTheme()
    const mainColor = theme.colors[type.color][theme.fn.primaryShade()]
    const bgColor = type.color === "dark" ? theme.colors.gray[1] : theme.colors[type.color][0]

    return (
        <UnstyledButton
            className={`${styles.tile} ${expanded ? styles.expanded : ""}`}
            style={{ "--bgColor": bgColor, "--mainColor": mainColor }}
            {...props}
            ref={ref}
        >
            <Stack spacing="xs">
                <Group position="apart" noWrap align="start">
                    <Group noWrap>
                        <Icon color={mainColor} />
                        <Text
                            size={calculateFontSize(type.name.length)}
                            color={`${type.color}.7`}
                            ff="Rubik"
                            weight={600}
                            transform="uppercase"
                        >
                            {type.name}
                        </Text>
                    </Group>

                    <QuantityCheckbox value={quantity} onChange={onQuantityChange} />
                </Group>

                {type.tags.length > 0 &&
                    <Group spacing="xs">
                        {type.tags.map((tag, i) =>
                            <Badge color={i == 0 ? type.color : "gray"} radius="sm" key={i}>
                                {tag}
                            </Badge>
                        )}
                    </Group>}

                <Text color="dimmed" size="sm">
                    {type.description}
                </Text>
            </Stack>
        </UnstyledButton>
    )
})
NodeTile.displayName = "NodePalette.NodeTile"


const MAX_QUANTITY = 10

function QuantityCheckbox({ value, onChange }) {

    // stash value when turned off
    const [stashedValue, setStashedValue] = useState(1)
    useEffect(() => {
        value != 0 && setStashedValue(value)
    }, [value])

    const handleGroupClick = event => {
        event.stopPropagation()
    }

    const increment = event => onChange?.(event.ctrlKey ? MAX_QUANTITY : Math.min(MAX_QUANTITY, value + 1))
    const decrement = event => onChange?.(event.ctrlKey ? 1 : Math.max(0, value - 1))
    const toggle = () => onChange?.(value ? 0 : stashedValue)

    return (
        <Group
            spacing={3}
            noWrap
            onClick={handleGroupClick}
            className={`${styles.cartQuantity} ${value > 0 ? styles.notEmpty : ""}`}
        >
            <ActionIcon component="div" radius="xl" size="md" onClick={decrement}>
                <TbMinus size={12} />
            </ActionIcon>
            <Button
                component="div"

                color={value == 0 ? "gray" : null}
                variant={value == 0 ? "outline" : "filled"}
                size="xs"
                radius="xl"
                compact
                p={value == 1 ? 0 : undefined}

                onClick={toggle}

                sx={{
                    aspectRatio: value < 10 ? "1" : "auto",
                }}
            >
                {value == 0 ? "" : value == 1 ? <TbCheck /> : value}
            </Button>
            <ActionIcon component="div" radius="xl" size="md" onClick={increment}>
                <TbPlus size={12} />
            </ActionIcon>
        </Group>
    )
}


function goToEndOfInput(el) {
    el && setTimeout(() => {
        el.selectionStart = el.selectionEnd = 10000
    }, 0)
}


function calculateFontSize(length, {
    minLength = 15,
    maxLength = 20,
    minSize = 14,
    maxSize = 18,
} = {}) {
    return Math.max(
        minSize,
        Math.min(
            maxSize,
            (length - minLength) / (maxLength - minLength) * (minSize - maxSize) + maxSize
        )
    )
}