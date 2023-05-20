import { Box, Group, ScrollArea, Stack, useMantineTheme } from "@mantine/core"
import { useReactFlow } from "reactflow"

import { openNodePalette } from "@web/modules/graph-util"

import { useFocusWithin, useHotkeys } from "@mantine/hooks"
import { CreatableNodeDefinitions } from "@minus/client-nodes"
import { arrayRemove, arrayUnion, useUserPreferences } from "@minus/client-sdk"
import SearchInput from "@web/components/SearchInput"
import { useSearch } from "@web/modules/search"
import DraggableNodeButton from "./DraggableNodeButton"


export default function NodeMenu() {

    const rf = useReactFlow()
    const theme = useMantineTheme()

    // hotkeys for opening node palette
    useHotkeys([
        ["mod+P", () => openNodePalette(rf)],
        ["mod+K", () => openNodePalette(rf)],
    ])

    // user preferences
    const [preferences, setPreference] = useUserPreferences()

    // searching nodes
    const [filteredNodeDefDefs, query, setQuery] = useSearch(NodeDefDefList, {
        selector: node => node.name + " " + node.description,
    })

    // changing search input placeholder if it's focused
    const { focused: searchFocused, ref: searchInputRef } = useFocusWithin()

    return (
        <Box className="absolute top-0 left-0 pointer-events-none">
            <Group p="xs" spacing={0} noWrap align="flex-start">
                <Stack
                    w="14rem"
                    className="pointer-events-auto"
                >

                    <SearchInput
                        noun="node"
                        quantity={NodeDefDefList.length}
                        hotkeys={["/"]}
                        value={query}
                        onChange={event => setQuery(event.currentTarget.value)}
                        onClear={() => setQuery("")}

                        // if search is focused, show "Start typing..." placeholder
                        {...(searchFocused && { placeholder: "Start typing..." })}
                        ref={searchInputRef}
                        // this makes the input line up with the node cards
                        mr="xxs"
                    />

                    {query.length > 0 &&
                        <ScrollArea.Autosize mah="80vh" offsetScrollbars scrollbarSize={theme.spacing.xxs}>
                            <Stack spacing="xxs">
                                {filteredNodeDefDefs.slice(0, 20).map(nodeDefDef =>
                                    <DraggableNodeButton
                                        id={nodeDefDef.id}
                                        showDescription bgOnHover
                                        pinned={preferences?.pinned?.includes(nodeDefDef.id)}
                                        onPin={() => setPreference("pinned", arrayUnion(nodeDefDef.id))}
                                        onUnpin={() => setPreference("pinned", arrayRemove(nodeDefDef.id))}
                                        key={nodeDefDef.id}
                                    />
                                )}
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

const NodeDefDefList = Object.values(CreatableNodeDefinitions)
