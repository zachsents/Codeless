import { useState, useCallback } from 'react'
import { useOnSelectionChange, useReactFlow } from 'reactflow'
import { ActionIcon, Box, Card, Group, Tooltip } from '@mantine/core'
import { motion, AnimatePresence } from "framer-motion"
import { TbTrash } from "react-icons/tb"


export default function Toolbar() {

    const rf = useReactFlow()

    const [selectedNodes, setSelectedNodes] = useState([])
    const [selectedEdges, setSelectedEdges] = useState([])

    // watch selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        setSelectedNodes(nodes)
        setSelectedEdges(edges)
    }, [])

    useOnSelectionChange({ onChange: onSelectionChange })

    // whether or not to show the toolbar -- 2 or more nodes or edges
    const show = selectedNodes.length + selectedEdges.length > 1

    // handle deletions
    const handleDelete = () => rf.deleteElements({ nodes: selectedNodes, edges: selectedEdges })


    // add this to config panel logic
    // const dragging = useNodeDragging(selectedNodes[0]?.id)
    // <NodeConfig node={selectedNodes[0]} key={selectedNodes[0].id} />

    return (
        <AnimatePresence>
            {show &&
                <Box sx={underScreenContainerStyle}>
                    <motion.div
                        initial={{ y: 120 }}
                        animate={{ y: 0 }}
                        exit={{ y: 120 }}
                        transition={{ type: "spring", duration: 0.4, bounce: 0.4 }}
                    >
                        <Card
                            px="xl"
                            py="xs"
                            shadow="md"
                            withBorder={false}
                            sx={cardStyle}
                        >
                            <Group spacing="lg">
                                <Tooltip label="Delete Selected">
                                    <ActionIcon color="red" size="lg" onClick={handleDelete}>
                                        <TbTrash size={22} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Card>
                    </motion.div>
                </Box>}
        </AnimatePresence >
    )
}


const cardStyle = ({
    borderRadius: "100vw",
    overflow: "visible",
})

const underScreenContainerStyle = ({
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
})