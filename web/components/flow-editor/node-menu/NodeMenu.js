import { Box, Group, ScrollArea, Stack, Text, useMantineTheme } from "@mantine/core"
import { useReactFlow } from "reactflow"

import { addNodeAtCenter, openNodePalette } from "@web/modules/graph-util"

import { useFocusWithin, useHotkeys } from "@mantine/hooks"
import { CreatableNodeDefinitions } from "@minus/client-nodes"
import { arrayRemove, arrayUnion, getNodeSuggestions, useUserPreferences } from "@minus/client-sdk"
import SearchInput from "@web/components/SearchInput"
import { useSearch } from "@web/modules/search"
import { jc } from "@web/modules/util"
import { useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import DraggableNodeButton from "./DraggableNodeButton"


export default function NodeMenu() {

    const rf = useReactFlow()
    const theme = useMantineTheme()

    // hotkeys for opening node palette
    useHotkeys([
        ["mod+P", () => openNodePalette(rf)],
        ["mod+K", () => openNodePalette(rf)],
    ])

    // ref for scrollarea
    const scrollAreaRef = useRef()

    // user preferences
    const [preferences, setPreference] = useUserPreferences()

    // searching nodes
    const [filteredNodeDefs, query, setQuery] = useSearch(NodeDefList, {
        selector: node => node.name + " " + node.description,
    })

    // search input focus state
    const { focused: searchFocused, ref: searchInputRef } = useFocusWithin()

    // search result selection
    const [selectedResultIndex, setSelectedResultIndex] = useState()

    // side-effect: when query or focus changes, reset selected result
    useEffect(() => {
        setSelectedResultIndex((query && searchFocused) ? 0 : null)
    }, [query, searchFocused])

    // hotkeys for selecting node
    const handleSearchKeyDown = event => {
        if (event.key === "ArrowDown") {
            event.preventDefault()
            setSelectedResultIndex(i => Math.min(i + 1, filteredNodeDefs.length - 1))
        }
        if (event.key === "ArrowUp") {
            event.preventDefault()
            setSelectedResultIndex(i => Math.max(i - 1, 0))
        }
        if (event.key === "Enter") {
            event.preventDefault()
            addNodeAtCenter(rf, filteredNodeDefs[selectedResultIndex].id)
            if (!event.ctrlKey && !event.metaKey)
                setQuery("")
        }
    }

    return (
        <Box className="absolute top-0 left-0 pointer-events-none">
            <Group p="xs" spacing={0} noWrap align="flex-start">
                <Stack
                    w="14rem"
                    className="pointer-events-auto"
                >

                    <SearchInput
                        noun="node"
                        quantity={NodeDefList.length}
                        hotkeys={["/"]}
                        value={query}
                        onChange={event => setQuery(event.currentTarget.value)}
                        onClear={() => setQuery("")}
                        onKeyDown={handleSearchKeyDown}

                        // if search is focused, show "Start typing..." placeholder
                        {...(searchFocused && { placeholder: "Start typing..." })}
                        ref={searchInputRef}
                        // this makes the input line up with the node cards
                        mr="xxs"
                    />

                    {(query.length > 0 || searchFocused) &&
                        <ScrollArea.Autosize
                            mah="80vh" offsetScrollbars scrollbarSize={theme.spacing.xxs}
                            viewportRef={scrollAreaRef}
                        >
                            <Stack spacing="xxs">
                                {query.length > 0 ?
                                    filteredNodeDefs.slice(0, 20).map((nodeDefDef, i) =>
                                        <DraggableNodeButton
                                            id={nodeDefDef.id}
                                            showDescription bgOnHover
                                            pinned={preferences?.pinned?.includes(nodeDefDef.id)}
                                            onPin={() => setPreference("pinned", arrayUnion(nodeDefDef.id))}
                                            onUnpin={() => setPreference("pinned", arrayRemove(nodeDefDef.id))}
                                            cardProps={{
                                                className: jc(i === selectedResultIndex && "!border-primary-600 bg-primary-100"),
                                            }}
                                            key={nodeDefDef.id}
                                        />
                                    ) :
                                    <>
                                        {/* <Group>
                                        <Badge>
                                            TO DO: add category search
                                        </Badge>
                                    </Group> */}
                                        <Suggestions />
                                    </>}
                            </Stack>
                        </ScrollArea.Autosize>}
                </Stack>

                <Group spacing="xxs" className="flex-1">
                    {preferences?.pinned?.map(pinnedId =>
                        <DraggableNodeButton
                            id={pinnedId}
                            pinned
                            onUnpin={() => setPreference("pinned", arrayRemove(pinnedId))}
                            bgOnHover
                            scaleOnHover
                            key={pinnedId}
                        />
                    )}
                </Group>
            </Group>
        </Box>
    )
}

const NodeDefList = Object.values(CreatableNodeDefinitions)


function Suggestions() {

    const rf = useReactFlow()

    const { data: suggestions } = useQuery({
        queryKey: "node-suggestions",
        queryFn: async () => {
            const nodes = rf.getNodes()
            const nodeTypes = [...new Set(nodes.map(node => node.type))]
            let suggestions = await Promise.all(
                nodeTypes.map(type =>
                    getNodeSuggestions(type)
                        .then(sugg => Object.values(sugg).flat())
                )
            ).then(arr => arr.flat())

            // sort by score
            suggestions.sort((a, b) => b.score - a.score)

            // remove duplicates
            suggestions = [...new Set(suggestions.map(sugg => sugg.node))]

            // filter out nodes that are already in the graph
            suggestions = suggestions.filter(sugg => !nodeTypes.includes(sugg))

            return suggestions
        },
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    return suggestions && suggestions.length > 0 && <>
        <Text size="xxs" color="dimmed">Suggested</Text>

        {suggestions.map(sugg =>
            <DraggableNodeButton
                id={sugg}
                showDescription bgOnHover
                includeMenu={false}
                key={sugg}
            />
        )}
    </>
}
