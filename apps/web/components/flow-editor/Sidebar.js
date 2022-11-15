import { useRef, useState } from 'react'
import { ActionIcon, Box, Grid, Group, Navbar, NavLink, ScrollArea, SimpleGrid, Space, Stack, Text, TextInput, Title } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks"
import { TbArrowLeft, TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse, TbSearch, TbX } from 'react-icons/tb'
import { useReactFlow } from "reactflow"

import LinkIcon from '../LinkIcon'
import NodeInfoPopover from './NodeInfoPopover'
import { NodeCategories } from "../../modules/nodes"
import { createNode } from 'node-builder'


export default function Sidebar() {

    const [expanded, sidebarHandlers] = useDisclosure(true)
    const [selectedCategory, setSelectedCategory] = useState()

    const [searchQuery, setSearchQuery] = useState("")
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
                        <Group position="apart">
                            <Title order={4}>Nodes</Title>
                            <ActionIcon radius="md" onClick={() => sidebarHandlers.close()}>
                                <TbLayoutSidebarLeftCollapse />
                            </ActionIcon>
                        </Group>
                        <TextInput
                            my={20}
                            radius="xl"
                            placeholder="Search Nodes"
                            value={searchQuery}
                            onChange={event => setSearchQuery(event.currentTarget.value)}
                            rightSection={
                                <ActionIcon onClick={() => {
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
                        sx={{ overflow: "visible" }}
                    >
                        <>
                            <Space h={10} />
                            {selectedCategory ?
                                <>
                                    <Grid align="center" m={0} mb={10}>
                                        <Grid.Col span={3}>
                                            <ActionIcon radius="md" onClick={() => setSelectedCategory(null)}>
                                                <TbArrowLeft />
                                            </ActionIcon>
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <Text align="center" color="dimmed" size="xs">
                                                {selectedCategory.label}
                                            </Text>
                                        </Grid.Col>
                                    </Grid>
                                    <Stack spacing="xs">
                                        {Object.values(selectedCategory.nodes).map(node =>
                                            <NodeInfoPopover node={node} key={node.id}>
                                                <Box>
                                                    <NodeTile node={node} />
                                                </Box>
                                            </NodeInfoPopover>
                                        )}
                                    </Stack>
                                </>
                                :
                                <>
                                    <Text align="center" color="dimmed" size="xs" mb={10}>Categories</Text>
                                    <SimpleGrid cols={2}>
                                        {NodeCategories.map((cat, i) =>
                                            <CategoryTile
                                                icon={cat.icon}
                                                // active={cat == selectedCategory}
                                                onClick={() => setSelectedCategory(cat)}
                                                key={cat.label + i}
                                            >
                                                {cat.label}
                                            </CategoryTile>
                                        )}
                                    </SimpleGrid>
                                </>
                            }
                        </>
                    </Navbar.Section>
                </>
                :
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
                            <LinkIcon label={cat.label} position="right" size="xl" radius="lg" key={cat.label + i} onClick={() => {
                                sidebarHandlers.open()
                                setSelectedCategory(cat)
                            }}>
                                <cat.icon fontSize={18} />
                            </LinkIcon>
                        )}
                    </Stack>
                </Navbar.Section>}
        </Navbar>
    )
}


const navbarStyle = theme => ({
    boxShadow: theme.shadows.sm,
    border: "none",
})


function NodeTile({ node, ...props }) {

    // adding nodes to graph
    const reactFlow = useReactFlow()
    const handleAddNode = () => {
        const center = reactFlow.project({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
        reactFlow.addNodes(createNode(node.id, center))
    }

    return (
        <NavLink
            label={node.name}
            variant="filled"
            onClick={handleAddNode}
            icon={<node.icon size={16} />}
            {...props}

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
    )
}


function CategoryTile({ children, icon: Icon, ...props }) {

    const iconSize = 32

    return (
        <NavLink
            label={children}
            variant="light"
            py={20}
            icon={<Icon size={iconSize} />}
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
