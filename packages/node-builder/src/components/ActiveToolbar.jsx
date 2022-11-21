import { ActionIcon, Box, Card, Divider, Group, Text, Tooltip } from '@mantine/core'
import { useState, useCallback, useMemo } from 'react'
import { useOnSelectionChange, useReactFlow, useUpdateNodeInternals } from 'reactflow'
import { TbAdjustments, TbAdjustmentsAlt, TbAdjustmentsOff, TbBooks, TbQuestionMark, TbTrash } from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"
import { useNodeBuilder } from './NodeBuilder'
import { removeEdges, removeNodes, useNodeState } from '../util'


export default function ActiveToolbar() {

    // const updateNodeInternals = useUpdateNodeInternals()

    const [selectedNodes, setSelectedNodes] = useState([])
    const [selectedEdges, setSelectedEdges] = useState([])

    // watch selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        setSelectedNodes(nodes)
        setSelectedEdges(edges)

        // need to update node internals to fix edge positions
        // nodes.forEach(node => console.log("updating") || updateNodeInternals(node.id))
    })
    useOnSelectionChange({ onChange: onSelectionChange })

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
                                <ToolbarContent selectedNodes={selectedNodes} selectedEdges={selectedEdges} />
                            </Group>
                        </Card>
                    </motion.div>
                </Box>}
        </AnimatePresence>
    )
}

function ToolbarContent({ selectedNodes, selectedEdges }) {

    // Single node
    if (selectedNodes.length == 1 && selectedEdges.length == 0) {

        const [state, setState] = useNodeState(selectedNodes[0].id)

        // grab node type
        const { nodeTypes } = useNodeBuilder()
        const nodeType = useMemo(() => {
            if (selectedNodes.length == 1)
                return nodeTypes[selectedNodes[0].type]
        }, [selectedNodes, nodeTypes])

        return (
            <>
                <Group spacing="xs">
                    <nodeType.icon />
                    <Text>{nodeType.name}</Text>
                    <Tooltip label="View Guides">
                        <ActionIcon size="lg" radius="md"><TbBooks fontSize={22} /></ActionIcon>
                    </Tooltip>
                </Group>
                <Divider orientation="vertical" />
                <Group spacing={5}>
                    {nodeType.expanded &&
                        (state.expanded ?
                            <Tooltip label="Hide Configuration">
                                <ActionIcon onClick={() => setState({ expanded: false })}><TbAdjustmentsOff fontSize={22} /></ActionIcon>
                            </Tooltip>
                            :
                            <Tooltip label="Configure Node">
                                <ActionIcon onClick={() => setState({ expanded: true })}><TbAdjustments fontSize={22} /></ActionIcon>
                            </Tooltip>)}

                    {selectedNodes[0].deletable !== false &&
                        <DeleteButton nodes={selectedNodes} edges={selectedEdges} label="Node" />}
                </Group>
            </>
        )
    }

    // Single edge
    if (selectedNodes.length == 0 && selectedEdges.length == 1)
        return (
            <>
                <Group spacing={5}>
                    <DeleteButton nodes={selectedNodes} edges={selectedEdges} label="Connection" />
                </Group>
            </>
        )

    // Default
    return (
        <>
            <Group spacing={5}>
                <DeleteButton nodes={selectedNodes} edges={selectedEdges} />
            </Group>
        </>
    )
}


function DeleteButton({ nodes, edges, label }) {

    const reactFlow = useReactFlow()

    const handleClick = () => {
        edges.length && removeEdges(edges.map(e => e.id), reactFlow)
        nodes.length && removeNodes(nodes.map(n => n.id), reactFlow)
    }

    return (
        <Tooltip label={label ? `Remove ${label}` : "Remove"}>
            <ActionIcon color="red" size="lg" radius="md" onClick={handleClick}><TbTrash fontSize={22} /></ActionIcon>
        </Tooltip>
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