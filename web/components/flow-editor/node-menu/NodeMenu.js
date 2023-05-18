import { ActionIcon, Box, Button, Checkbox, Kbd, Menu, Stack, Text, Tooltip } from "@mantine/core"
import { useReactFlow } from "reactflow"

import { openNodePalette } from "@web/modules/graph-util"

import { useHotkeys } from "@mantine/hooks"
import { arrayRemove, arrayUnion, useUserPreferences } from "@minus/client-sdk"
import { TbDots, TbSearch } from "react-icons/tb"
import DraggableNodeButton from "./DraggableNodeButton"


const suggested = [
    "basic:Text",
    "googlesheets:Table",
    "airtable:UseTable",
    "openai:Extract",
]


export default function NodeMenu() {

    const rf = useReactFlow()

    useHotkeys([
        ["mod+P", () => openNodePalette(rf)],
        ["mod+K", () => openNodePalette(rf)],
        ["/", () => openNodePalette(rf)],
    ])

    // user preferences
    const [preferences, setPreference] = useUserPreferences()

    const showSuggested = preferences?.showSuggested ?? true
    const showPinned = preferences?.showPinned ?? true

    return (
        <Stack spacing="md" p="xl" pos="absolute" top={0} left={0} miw={220}>
            <Box pos="relative">
                <Text align="center" weight={600} size="lg">Add Nodes</Text>
                <Box pos="absolute" right={0} top="50%" sx={{ transform: "translateY(-50%)", zIndex: 199 }}>
                    <Menu>
                        <Menu.Target>
                            <ActionIcon>
                                <TbDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                closeMenuOnClick={false}
                                icon={<Checkbox checked={showSuggested} radius="sm" readOnly />}
                                p="xs"
                                onClick={() => setPreference("showSuggested", !showSuggested)}
                            >
                                <Text>Get Started</Text>
                            </Menu.Item>
                            <Menu.Item
                                closeMenuOnClick={false}
                                icon={<Checkbox checked={showPinned} radius="sm" readOnly />}
                                p="xs"
                                onClick={() => setPreference("showPinned", !showPinned)}
                            >
                                <Text>Pinned</Text>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Box>
            </Box>

            <Tooltip
                color="transparent"
                position="right" label={<Text color="dark">
                    <Kbd>Ctrl</Kbd> + <Kbd>P</Kbd>
                </Text>}
            >
                <Button onClick={() => openNodePalette(rf)} leftIcon={<TbSearch />} variant="light">
                    Search Nodes
                </Button>
            </Tooltip>

            {showSuggested &&
                <Stack spacing="sm">
                    <Text size="xs" lh={0.5} color="dimmed">Get Started</Text>

                    {suggested.filter(sugg => !preferences?.pinned?.includes(sugg))
                        .map(sugg =>
                            <DraggableNodeButton
                                id={sugg}
                                onPin={() => setPreference("pinned", arrayUnion(sugg))}
                                key={sugg}
                            />
                        )}
                </Stack>}

            {showPinned &&
                <Stack spacing="sm">
                    <Text size="xs" lh={0.5} color="dimmed">Pinned</Text>

                    {preferences?.pinned?.map(sugg =>
                        <DraggableNodeButton
                            id={sugg}
                            onUnpin={() => setPreference("pinned", arrayRemove(sugg))}
                            pinned
                            key={sugg}
                        />
                    )}
                </Stack>}
        </Stack>
    )

    // return (
    //     <Navbar
    //         width={{ base: expanded ? 240 : 70 }}
    //         p="md"
    //         sx={navbarStyle}
    //     >
    //         <Group position="right">
    //             <CollapseButton expanded={expanded} open={expandHandlers.open} close={expandHandlers.close} />
    //         </Group>

    //         <Space h="xl" />

    //         <Stack>
    //             <AddNodeButton expanded={expanded} />

    //             <SimpleGrid cols={expanded ? 3 : 1}>
    //                 <ActionButton
    //                     expanded={expanded}
    //                     label="Fit View to Nodes"
    //                     icon={TbMaximize}
    //                     onClick={() => rf.fitView({ duration: 200 })}
    //                 />
    //                 <ActionButton
    //                     expanded={expanded}
    //                     label="Find Node (WIP)"
    //                     icon={TbSearch}
    //                 />
    //                 <ActionButton
    //                     expanded={expanded}
    //                     label="Add Caption (WIP)"
    //                     icon={TbTypography}
    //                 />
    //             </SimpleGrid>

    //             <Space h="xl" />

    //             {expanded && <ColorSelector />}
    //         </Stack>
    //     </Navbar >
    // )
}
