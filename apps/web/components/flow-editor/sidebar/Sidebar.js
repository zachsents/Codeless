import { forwardRef, useEffect, useRef, useState } from "react"
import { useReactFlow } from "reactflow"
import { Box, Navbar, NavLink, Stack, Space, SimpleGrid, Group, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { TbMaximize, TbSearch, TbTypography } from "react-icons/tb"
import { motion } from "framer-motion"

import { createNode } from "@minus/graph-util"

import CollapseButton from "./CollapseButton"
import ActionButton from "./ActionButton"
import AddNodeButton from "./AddNodeButton"
import ColorSelector from "./ColorSelector"


export default function Sidebar() {

    const rf = useReactFlow()
    const [expanded, expandHandlers] = useDisclosure(true)

    return (
        <Navbar
            width={{ base: expanded ? 240 : 70 }}
            p="md"
            sx={navbarStyle}
        >
            <Group position="right">
                <CollapseButton expanded={expanded} open={expandHandlers.open} close={expandHandlers.close} />
            </Group>

            <Space h="xl" />

            <Stack>
                <AddNodeButton expanded={expanded} />

                <SimpleGrid cols={expanded ? 3 : 1}>
                    <ActionButton
                        expanded={expanded}
                        label="Fit View to Nodes"
                        icon={TbMaximize}
                        onClick={() => rf.fitView({ duration: 200 })}
                    />
                    <ActionButton
                        expanded={expanded}
                        label="Find Node (WIP)"
                        icon={TbSearch}
                    />
                    <ActionButton
                        expanded={expanded}
                        label="Add Caption (WIP)"
                        icon={TbTypography}
                    />
                </SimpleGrid>

                <Space h="xl" />

                {expanded && <ColorSelector />}

                {expanded &&
                    <>
                        <Text align="center" size="sm">
                            Coming soon: captions, better suggestions, filtered searching, better testing tools, and a lot more (all the post-its on the wall)
                        </Text>
                    </>}
            </Stack>
        </Navbar >
    )
}


const navbarStyle = theme => ({
    boxShadow: theme.shadows.sm,
    border: "none",
    transition: "width 0.15s",
})




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
