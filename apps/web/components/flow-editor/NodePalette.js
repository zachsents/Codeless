import { Badge, Group, HoverCard, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { Square } from 'tabler-icons-react'
import { Nodes } from '../../modules/nodes'
import { createNode } from '../../modules/graph-util'
import Search from '../Search'


const NodeList = Object.values(Nodes)
    .filter(nodeType => !nodeType.hideInBrowser)


export default function NodePalette({ context, id, innerProps: { rf } }) {

    // adding nodes
    const addNode = useCallback(type => {
        // add node at center
        const proj = rf.project({
            x: (window.innerWidth - 240) / 2,
            y: (window.innerHeight - 60) / 2,
        })
        proj.x -= 56 / 2
        proj.y -= 56 / 2
        rf.addNodes(createNode(type.id, proj))
        context.closeModal(id)
    }, [rf])

    // Moving focus with arrow keys
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

    return (
        <Stack>
            <Search
                list={NodeList}
                selector={type => type.name + type.description}
                noun="node"
                component={NodeTile}
                componentItemProp="type"
                componentProps={(type, i, { query }) => ({
                    onClick: () => addNode(type),
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
            />
        </Stack>
    )
}


const NodeTile = forwardRef(({ type, expanded, ...props }, ref) => {

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


const tileStyle = theme => ({
    backgroundColor: theme.colors.gray[0],
    borderRadius: theme.radius.md,
    display: "flex",
    flexDirection: "column",
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