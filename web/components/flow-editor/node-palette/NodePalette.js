import { Button, Group, SimpleGrid, Stack, TextInput, Title } from "@mantine/core"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { useDebouncedState, useListState, useSetState } from "@mantine/hooks"
import { CreatableNodeDefinitions, CreatableTags } from "@minus/client-nodes"
import { addNodeAtCenter, addNodesAtCenter } from "@web/modules/graph-util"
import { NodeDefinitionSearcher } from "@web/modules/search"
import { TbArrowRight, TbX } from "react-icons/tb"
import ResultTile from "./ResultTile"
import TagTile from "./TagTile"



const NodeIds = Object.keys(CreatableNodeDefinitions)
const NodeSearcher = new NodeDefinitionSearcher(CreatableNodeDefinitions)

const NumColumns = 2


// eslint-disable-next-line no-unused-vars
export default function NodePalette({ context, id, innerProps: { rf, suggestions, onAdd } }) {

    // // adding nodes
    const addNode = type => {
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
    const containerRef = useRef()

    // Right or Down arrow keys move focus to first tile
    const searchKeyHandler = useCallback(event => {
        if (event.key == "ArrowDown" || event.key == "ArrowRight")
            containerRef.current?.querySelector("[tabindex=\"1\"]")?.focus()
    }, [containerRef.current])

    // Arrow keys move focus between tiles
    const tileKeyHandler = useCallback(event => {

        let tabIndex = parseInt(event.target.getAttribute("tabindex"))

        switch (event.key) {
            case "ArrowRight": tabIndex++
                break
            case "ArrowLeft": tabIndex--
                break
            case "ArrowUp": tabIndex -= NumColumns
                break
            case "ArrowDown": tabIndex += NumColumns
                break
            case "Enter":
                event.target.click()
                break
            case "Tab":
                break
            default: tabIndex = 0
                break
        }

        containerRef.current?.querySelector(`[tabindex="${Math.max(0, tabIndex)}"]`)?.focus()
    }, [containerRef.current])

    // TO DO: add this back in
    // // show suggestions in separate section
    // const suggestedSearchLists = useMemo(() => {
    //     if (!suggestions)
    //         return null

    //     const otherNodes = []
    //     const suggestedNodes = NodeList.filter(
    //         node => suggestions.includes(node.id) || (otherNodes.push(node), false)
    //     )

    //     return [
    //         { name: "Suggested", list: suggestedNodes },
    //         { name: "Other Nodes", list: otherNodes },
    //     ]
    // }, [suggestions])

    const searchRef = useRef()
    const [query, setQuery] = useDebouncedState("", 200)
    const [filters, filterHandlers] = useListState([])

    // side-effect: focus on search input when filters or node cart changes
    useEffect(() => {
        searchRef.current?.focus()
    }, [filters, nodeCart])

    const nodesShowing = useMemo(() =>
        NodeSearcher.search(query)
            .filter(id => !filters.length || CreatableNodeDefinitions[id].tags.some(tag => filters.includes(tag)))
            .slice(0, query ? 30 : 10),
        [query, filters]
    )

    return (
        <Stack ref={containerRef}>
            <Group>
                <TextInput
                    defaultValue={query}
                    onChange={event => setQuery(event.currentTarget.value)}
                    placeholder={`Search ${NodeIds.length} nodes...`}
                    size="lg"
                    data-autofocus
                    tabIndex={0}
                    sx={{ flexGrow: 1, }}
                    onKeyDown={searchKeyHandler}
                    ref={searchRef}
                />

                {cartTotal > 0 &&
                    <Button
                        onClick={finishCart}
                        rightIcon={<TbArrowRight />}
                    >
                        Add {cartTotal} Nodes
                    </Button>}
            </Group>
            <Group spacing="xs">
                {filters.map(filter =>
                    <Button
                        color={CreatableTags.find(tag => tag.id == filter).color ?? "gray"}
                        onClick={() => filterHandlers.remove(filters.indexOf(filter))}
                        size="md"
                        variant="outline"
                        compact
                        leftIcon={<TbX />}
                        key={filter}
                    >
                        {filter}
                    </Button>
                )}
            </Group>

            <Title order={4} align="center">Categories</Title>
            <Group spacing="xl" position="center">
                {CreatableTags.filter(tag => tag.icon && !filters.includes(tag.id))
                    .map(tag =>
                        <TagTile tag={tag} onClick={() => filterHandlers.append(tag.id)} key={tag.id} />
                    )}
            </Group>

            <Title order={4} align="center">Nodes</Title>

            <SimpleGrid cols={NumColumns}>
                {nodesShowing.map((id, i) =>
                    <ResultTile
                        type={CreatableNodeDefinitions[id]}
                        quantity={nodeCart[id] ?? 0}
                        onQuantityChange={qty => setNodeCart({ [id]: qty })}

                        onClick={() => addNode(CreatableNodeDefinitions[id])}
                        onKeyDown={tileKeyHandler}
                        tabIndex={i + 1}
                        key={id}
                    />
                )}
            </SimpleGrid>
        </Stack >
    )
}