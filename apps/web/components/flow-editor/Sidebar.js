import { useRef, useState } from 'react'
import { ActionIcon, Box, Collapse, Grid, Group, HoverCard, Navbar, NavLink, ScrollArea, SimpleGrid, Space, Stack, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks"
import { TbArrowLeft, TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse, TbMath, TbSearch, TbSettings, TbTypography, TbX } from 'react-icons/tb'
import LinkIcon from '../LinkIcon'
import NodeInfoPopover from './NodeInfoPopover'

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
                                        {nodes[selectedCategory.value].map((node, i) =>
                                            <NodeInfoPopover key={i}>
                                                <Box>
                                                    <NodeTile>{node}</NodeTile>
                                                </Box>
                                            </NodeInfoPopover>
                                        )}
                                    </Stack>
                                </>
                                :
                                <>
                                    <Text align="center" color="dimmed" size="xs" mb={10}>Categories</Text>
                                    <SimpleGrid cols={2}>
                                        {categories.map(cat =>
                                            <CategoryTile
                                                icon={<cat.icon />}
                                                active={cat.value == selectedCategory?.value}
                                                onClick={() => setSelectedCategory(cat)}
                                                key={cat.value}
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
                        {categories.map(cat =>
                            <LinkIcon label={cat.label} position="right" size="xl" radius="lg" key={cat.value} onClick={() => {
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


const categories = [
    { label: "Math", icon: TbMath, value: "math" },
    { label: "Utility", icon: TbSettings, value: "utility" },
    { label: "Text", icon: TbTypography, value: "text" },
]

const nodes = {
    math: ["this", "that"],
    utility: ["this", "and", "that"],
    text: ["this", "pr", "or"],
}

function NodeTile({ children, ...props }) {
    return (
        <NavLink
            label={children}
            variant="filled"
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


function CategoryTile({ children, ...props }) {
    return (
        <NavLink
            label={children}
            variant="light"
            py={20}
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
                    fontSize: 32
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
