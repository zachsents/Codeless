import { ActionIcon, Box, Card, Divider, Group, Text, Tooltip } from '@mantine/core'
import { useState, useCallback, useMemo } from 'react'
import { useOnSelectionChange } from 'reactflow'
import { TbQuestionMark, TbTrash } from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"
import { useNodeBuilder } from './NodeBuilder'


export default function ActiveToolbar() {

    const [selectedNodes, setSelectedNodes] = useState([])
    const [selectedEdges, setSelectedEdges] = useState([])

    // watch selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        setSelectedNodes(nodes)
        setSelectedEdges(edges)
    })
    useOnSelectionChange({ onChange: onSelectionChange })

    // grab node type
    const { nodeTypes } = useNodeBuilder()
    const nodeType = useMemo(() => {
        if (selectedNodes.length == 1)
            return nodeTypes[selectedNodes[0].type]
    }, [selectedNodes, nodeTypes])

    return (
        <AnimatePresence>
            {!!(selectedNodes.length || selectedEdges.length) &&
                <Box sx={containerStyle}>
                    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}>
                        <Card
                            px="xl"
                            py="xs"
                            shadow="md"
                            withBorder={false}
                            sx={cardStyle}
                        >
                            <Group spacing="lg">
                                {selectedNodes.length == 1 && selectedEdges.length == 0 &&
                                    <>
                                        <Group spacing="xs">
                                            <nodeType.icon />
                                            <Text>{nodeType.name}</Text>
                                            <Tooltip label="Need help?">
                                                <ActionIcon size="lg" radius="md"><TbQuestionMark fontSize={18} /></ActionIcon>
                                            </Tooltip>
                                        </Group>
                                        <Divider orientation="vertical" />
                                        <Group spacing={5}>
                                            <Tooltip label="Remove Node">
                                                <ActionIcon color="red" size="lg" radius="md"><TbTrash fontSize={18} /></ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </>
                                }
                            </Group>
                        </Card>
                    </motion.div>
                </Box>}
        </AnimatePresence>
    )
}


const cardStyle = theme => ({
    borderRadius: "100vw",
    overflow: "visible",
})

const containerStyle = theme => ({
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
})