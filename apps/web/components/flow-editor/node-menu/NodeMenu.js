import { ActionIcon, Box, Button, Checkbox, Kbd, Menu, NavLink, Stack, Text, Tooltip } from "@mantine/core"
import { motion } from "framer-motion"
import { forwardRef, useEffect, useRef, useState } from "react"
import { useReactFlow } from "reactflow"

import { createNode, openNodePalette } from "@web/modules/graph-util"

import { useHotkeys, useSetState } from "@mantine/hooks"
import { TbDots, TbSearch } from "react-icons/tb"
import DraggableNodeButton from "./DraggableNodeButton"


export default function NodeMenu() {

    const rf = useReactFlow()

    const [showing, setShowing] = useSetState({
        suggested: true,
        pinned: true,
    })

    useHotkeys([
        ["ctrl+P", () => openNodePalette(rf)]
    ])

    return (
        <Stack spacing="md" p="xl" pos="absolute" top={0} left={0} miw={220}>
            <Box pos="relative">
                <Text align="center" weight={600} size="lg">Add Nodes</Text>
                <Box pos="absolute" right={0} top="50%" sx={{ transform: "translateY(-50%)", zIndex: 200 }}>
                    <Menu>
                        <Menu.Target>
                            <ActionIcon>
                                <TbDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                closeMenuOnClick={false}
                                icon={<Checkbox checked={showing.suggested} radius="sm" />}
                                p="xs"
                                onClick={() => setShowing({ suggested: !showing.suggested })}
                            >
                                <Text>Suggested</Text>
                            </Menu.Item>
                            <Menu.Item
                                closeMenuOnClick={false}
                                icon={<Checkbox checked={showing.pinned} radius="sm" />}
                                p="xs"
                                onClick={() => setShowing({ pinned: !showing.pinned })}
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

            {showing.suggested && <Stack spacing="sm">
                <Text size="xs" lh={0.5} color="dimmed">Suggested</Text>
                <DraggableNodeButton id="googlesheets:Spreadsheet" />
                <DraggableNodeButton id="openai:Parse" />
            </Stack>}

            {showing.pinned && <Stack spacing="sm">
                <Text size="xs" lh={0.5} color="dimmed">Pinned</Text>
                <DraggableNodeButton id="googlesheets:Spreadsheet" pinned />
                <DraggableNodeButton id="openai:Parse" pinned />
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




/**
 * Keeping this around b/c it has all the dragging stuff in it
 */
const NodeTile = forwardRef(({ node }, ref) => {

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

NodeTile.displayName = "NodeTile"
