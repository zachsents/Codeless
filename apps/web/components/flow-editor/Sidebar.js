import { forwardRef, useEffect, useRef, useState, useMemo } from 'react'
import { ActionIcon, Box, Button, Group, Navbar, NavLink, ScrollArea, Stack, SimpleGrid, Space, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure, useDebouncedState } from "@mantine/hooks"
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse, TbSearch, TbX } from 'react-icons/tb'
import { useReactFlow } from "reactflow"
import fuzzy from "fuzzy"

import LinkIcon from '../LinkIcon'
import NodeInfoPopover from './NodeInfoPopover'
import { NodeCategories } from "../../modules/nodes"
import { createNode } from 'node-builder'

import { motion } from 'framer-motion'


export default function Sidebar() {

    const [expanded, sidebarHandlers] = useDisclosure(true)

    // make an alphabetical list of all nodes that are in categories
    // doing this to avoid showing nodes that aren't in categories
    const AllNodes = useMemo(
        () => [...new Set(NodeCategories.map(cat => cat.nodes).flat())]
            .sort((a, b) => {
                const textA = a.name.toUpperCase(), textB = b.name.toUpperCase()
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
            }),
        []
    )

    // states for searching
    const [searchQuery, setSearchQuery] = useDebouncedState("", 100)

    // state for which nodes are showing
    const [selectedCategory, setSelectedCategory] = useState()
    const [showingNodes, setShowingNodes] = useState(AllNodes)
    const queriedNodes = useMemo(
        () => showingNodes.filter(node => fuzzy.test(searchQuery, node.name)),
        [searchQuery, showingNodes]
    )

    const handleCategorySelection = cat => {
        setSelectedCategory(cat.title)
        setShowingNodes(cat.nodes)
    }

    const handleClearSelection = () => {
        setSelectedCategory(null)
        setShowingNodes(AllNodes)
    }

    // search bar ref for focusing on it when sidebar is expanded
    const searchBarRef = useRef()

    return (
        <Navbar
            width={{ base: expanded ? 240 : 70 }}
            p="md"
            sx={navbarStyle}
        >
            {expanded ?
                <>
                    <Navbar.Section>
                        {/* Section Title & Collapse Control */}
                        <Group position="apart">
                            <Title order={4}>Nodes</Title>
                            <ActionIcon radius="md" onClick={() => sidebarHandlers.close()}>
                                <TbLayoutSidebarLeftCollapse />
                            </ActionIcon>
                        </Group>

                        {/* Search Bar */}
                        <TextInput
                            my={20}
                            radius="xl"
                            placeholder="Search Nodes"
                            onChange={event => setSearchQuery(event.currentTarget.value)}
                            rightSection={
                                <ActionIcon onClick={() => {
                                    searchBarRef.current.value = ""
                                    setSearchQuery("")
                                    searchBarRef.current.focus()
                                }} radius="xl"><TbX /></ActionIcon>
                            }
                            ref={searchBarRef}
                        />

                    </Navbar.Section>

                    <Navbar.Section
                        grow
                        component={ScrollArea}
                        mr={-12}
                        pr={12}
                        // pl={6}
                        scrollbarSize={6}
                        scrollHideDelay={300}
                        type="scroll"
                        styles={{
                            scrollbar: {
                                '&[data-orientation="horizontal"] .mantine-ScrollArea-thumb': {
                                    visibility: "hidden",
                                },
                            }
                        }}
                    >
                        <Space h={10} />

                        {/* Category Tiles */}
                        {!selectedCategory && !searchQuery &&
                            <>
                                <Text align="center" color="dimmed" size="xs" mb={10}>Categories</Text>
                                <SimpleGrid cols={2}>
                                    {NodeCategories.map((cat, i) =>
                                        <CategoryTile
                                            icon={cat.icon}
                                            onClick={() => handleCategorySelection(cat)}
                                            key={cat.title + i}
                                        >
                                            {cat.title}
                                        </CategoryTile>
                                    )}
                                </SimpleGrid>
                                <Space h="xl" />
                            </>}

                        {/* Nodes */}
                        {selectedCategory ?
                            <Group position="center">
                                <Text color="dimmed" size="xs">Nodes</Text>
                                <Button
                                    variant="outline"
                                    radius="xl"
                                    size="sm"
                                    compact
                                    leftIcon={<TbX size={10} />}
                                    onClick={handleClearSelection}
                                >
                                    {selectedCategory}
                                </Button>
                            </Group> :
                            <Text align="center" color="dimmed" size="xs">Nodes</Text>
                        }
                        <Stack spacing="xs" mt={10}>
                            {queriedNodes.map(node =>
                                <NodeInfoPopover node={node} key={node.id}>
                                    <NodeTile node={node} />
                                </NodeInfoPopover>
                            )}
                        </Stack>
                    </Navbar.Section>
                </>
                :
                // Collapsed Sidebar
                <Navbar.Section>
                    <Stack align="center" spacing="xs">
                        <LinkIcon label="Expand" position="right" size="xl" radius="lg" onClick={() => sidebarHandlers.open()}>
                            <TbLayoutSidebarRightCollapse fontSize={18} />
                        </LinkIcon>
                        <LinkIcon label="Search" position="right" size="xl" radius="lg" onClick={() => {
                            sidebarHandlers.open()
                            setTimeout(() => {
                                searchBarRef.current?.focus()
                            }, 100)
                        }}>
                            <TbSearch fontSize={18} />
                        </LinkIcon>
                        <Space h={10} />
                        {NodeCategories.map((cat, i) =>
                            <LinkIcon label={cat.title} position="right" size="xl" radius="lg" key={cat.title + i} onClick={() => {
                                sidebarHandlers.open()
                                handleCategorySelection(cat)
                            }}>
                                <cat.icon fontSize={18} />
                            </LinkIcon>
                        )}
                    </Stack>
                </Navbar.Section>
            }
        </Navbar >
    )
}


const navbarStyle = theme => ({
    boxShadow: theme.shadows.sm,
    border: "none",
    transition: "width 0.15s",
})


const NodeTile = forwardRef(({ node, ...props }, ref) => {

    // adding nodes to graph
    const rf = useReactFlow()
    const handleAddNode = location => {

        // add node at location
        if (location) {
            const canvasLocation = {
                x: location.x - 240,
                y: location.y - 60,
            }

            // make sure it's inbounds
            if (canvasLocation.x < 0 || canvasLocation.y < 0)
                return

            const proj = rf.project(canvasLocation)
            proj.x -= 15
            proj.y -= 15
            rf.addNodes(createNode(node.id, proj))
            return
        }

        // add node at center
        const proj = rf.project({
            x: (window.innerWidth - 240) / 2,
            y: (window.innerHeight - 60) / 2,
        })
        proj.x -= 56 / 2
        proj.y -= 56 / 2
        rf.addNodes(createNode(node.id, proj))
    }

    // attach ref to object so we can get height
    const [boxHeight, setBoxHeight] = useState()
    const buttonRef = useRef()
    useEffect(() => {
        buttonRef.current?.offsetHeight && setBoxHeight(buttonRef.current?.offsetHeight)
    }, [buttonRef.current?.offsetHeight])

    // state for when drag is finished
    const [finishingDrag, setFinishingDrag] = useState(false)
    useEffect(() => {
        finishingDrag && setFinishingDrag(false)
    }, [finishingDrag])

    return (
        <Box sx={{ height: boxHeight }} ref={ref}>
            {!finishingDrag && <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
                drag
                whileDrag={{ position: "fixed", zIndex: 200 }}
                dragSnapToOrigin
                onDragEnd={(event, info) => {
                    setFinishingDrag(true)
                    handleAddNode(info.point)
                }}
                onTap={() => handleAddNode()}
            >
                <NavLink
                    label={node.name}
                    variant="filled"
                    // onClick={handleAddNode}
                    icon={node.icon && <node.icon size={16} />}
                    ref={buttonRef}

                    styles={theme => ({
                        root: {
                            // flexDirection: "column",
                            // justifyContent: "center",
                            // alignItems: "center",
                            backgroundColor: theme.colors.gray[0],
                            "&:hover": {
                                backgroundColor: theme.colors.gray[1],
                            },
                            borderRadius: theme.radius.md
                        },
                        label: {
                            fontWeight: 500,
                        },
                    })}
                />
            </motion.div>}
        </Box>
    )
})


function CategoryTile({ children, icon: Icon, ...props }) {

    const iconSize = 32

    return (
        <NavLink
            label={children}
            variant="light"
            py={20}
            icon={Icon && <Icon size={iconSize} />}
            {...props}

            styles={theme => ({
                root: {
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: theme.radius.lg,

                    backgroundColor: theme.colors.gray[0],
                    "&:hover": {
                        backgroundColor: theme.colors.gray[1],
                    },
                },
                icon: {
                    margin: 0,
                    fontSize: iconSize,
                },
                label: {
                    fontWeight: 500,
                },
                body: {
                    flex: "0 auto",
                }
            })}
        />
    )
}
