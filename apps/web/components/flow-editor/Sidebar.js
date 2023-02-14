import { forwardRef, useEffect, useRef, useState, useCallback } from "react"
import { useReactFlow } from "reactflow"
import { Box, Button, Navbar, NavLink, Stack, Space, Text, Title, Kbd, Grid, Tooltip } from "@mantine/core"
import { useDisclosure, useHotkeys } from "@mantine/hooks"
import { Tb3DCubeSphere, TbMaximize, TbPlus, TbSearch } from "react-icons/tb"

import { createNode } from "../../modules/graph-util"

import { motion } from "framer-motion"
import { openContextModal } from "@mantine/modals"


export default function Sidebar() {

    const rf = useReactFlow()

    const [expanded, sidebarHandlers] = useDisclosure(true)

    const openNodePalette = useCallback(() => openContextModal({
        modal: "NodePalette",
        innerProps: { rf },
        title: <Title order={3}>Add a node</Title>,
        size: "lg",
        centered: true,
        transitionDuration: 200,
    }), [rf])

    useHotkeys([
        ["ctrl+P", openNodePalette]
    ])

    return (
        <Navbar
            width={{ base: expanded ? 240 : 70 }}
            p="md"
            sx={navbarStyle}
        >
            <Space h="xl" />
            <Stack>
                <Grid>
                    <Grid.Col span={4}>
                        <Tooltip label="Fit View to Nodes">
                            <Button p={0} fullWidth color="gray" size="md" variant="light">
                                <TbMaximize size={24} />
                            </Button>
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Tooltip label="Find Node">
                            <Button p={0} fullWidth disabled color="gray" size="md" variant="light">
                                <TbSearch size={24} />
                            </Button>
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Tooltip label="Fit View to Nodes">
                            <Button p={0} fullWidth disabled color="gray" size="md" variant="light">
                                <Tb3DCubeSphere size={24} />
                            </Button>
                        </Tooltip>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Tooltip color="transparent" position="bottom" label={
                            <Text size="xs" align="center">
                                <Kbd>Ctrl</Kbd> + <Kbd>P</Kbd>
                            </Text>
                        }>
                            <Button
                                size="md"
                                variant="light"
                                fullWidth
                                leftIcon={<TbPlus />}
                                mb="xs"
                                onClick={openNodePalette}
                            >
                                Add Node
                            </Button>
                        </Tooltip>

                    </Grid.Col>
                </Grid>
            </Stack>
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

NodeTile.displayName = "NodeTile"
