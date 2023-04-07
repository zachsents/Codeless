import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ActionIcon, Badge, Button, Group, HoverCard, Stack, Text, Title, UnstyledButton } from "@mantine/core"
import { Square } from "tabler-icons-react"

import { addNodeAtCenter, addNodesAtCenter } from "@web/modules/graph-util"
import Search from "../Search"
import { useSetState } from "@mantine/hooks"
import { TbArrowRight, TbCheck, TbMinus, TbPlus } from "react-icons/tb"
import { CreatableNodeDefinitions } from "@minus/client-nodes"


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
    const handleAddCart = () => {
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

    // focus search bar on mount
    useEffect(() => {
        setTimeout(() => {
            searchRef.current?.focus()
        }, 0)
    }, [searchRef.current])

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
                    <Button onClick={handleAddCart} rightIcon={<TbArrowRight />}>Add {cartTotal} Nodes</Button>}
            />
        </Stack>
    )
}


const NodeTile = forwardRef(({ type, expanded, quantity, onQuantityChange, ...props }, ref) => {

    const Icon = type.icon ?? Square

    return (
        <UnstyledButton
            p="md"
            px={expanded ? "xl" : "md"}
            h={expanded ? 100 : 120}
            sx={tileStyle}
            {...props}
            ref={ref}
        >
            <Stack spacing="xs">
                <Group position="apart" noWrap align="start">
                    <Group>
                        <Icon />
                        <Title order={4}>{type.name}</Title>
                        {type.badge &&
                            <Group>
                                {(type.badge.map ? type.badge : [type.badge]).map(
                                    (badge, i) => <Badge color={badge.color ?? type.color} key={i}>{badge}</Badge>
                                )}
                            </Group>}
                    </Group>

                    <QuantityCheckbox value={quantity} onChange={onQuantityChange} />
                </Group>
                <HoverCard openDelay={500}>
                    <HoverCard.Target>
                        <Text lineClamp={1} color="dimmed" size="sm">
                            {type.description}
                        </Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text maw={350} color="dimmed">
                            {type.description}
                        </Text>
                    </HoverCard.Dropdown>
                </HoverCard>
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
            sx={{
                opacity: value > 0 ? 1 : 0.3,
                transition: "opacity 0.1s",
                "&:hover": {
                    opacity: 1,
                }
            }}
        >
            <ActionIcon radius="xl" size="md" onClick={decrement}><TbMinus size={12} /></ActionIcon>
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
            <ActionIcon radius="xl" size="md" onClick={increment}><TbPlus size={12} /></ActionIcon>
        </Group>
    )
}


const tileStyle = theme => ({
    backgroundColor: theme.colors.gray[0],
    borderRadius: theme.radius.md,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    transition: "backgroundColor 0.1s",
    "&:hover, &:focus": {
        backgroundColor: theme.colors.gray[1],
    },
})


function goToEndOfInput(el) {
    el && setTimeout(() => {
        el.selectionStart = el.selectionEnd = 10000
    }, 0)
}