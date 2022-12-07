import { ActionIcon, Box, Card, Divider, Group, Text, Stack, Tooltip, Center, Space } from '@mantine/core'
import { useState, useCallback } from 'react'
import { useNodes, useOnSelectionChange, useReactFlow, useStore, useStoreApi } from 'reactflow'
import { TbAdjustments, TbBooks, TbTrash } from "react-icons/tb"
import { motion, AnimatePresence } from "framer-motion"
import { removeEdges, removeNodes, useNodeData, useNodeDisplayProps, useNodeType } from '../util'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useWindowScroll } from '@mantine/hooks'


export default function ActiveDetails() {

    const [selectedNodes, setSelectedNodes] = useState([])
    const [selectedEdges, setSelectedEdges] = useState([])

    // watch selection changes
    const onSelectionChange = useCallback(({ nodes, edges }) => {
        setSelectedNodes(nodes)
        setSelectedEdges(edges)
    })
    useOnSelectionChange({ onChange: onSelectionChange })

    const emptySelection = selectedNodes.length == 0 && selectedEdges.length == 0
    const singleNodeSelected = selectedNodes.length == 1 && selectedEdges.length == 0

    return (
        <AnimatePresence>
            {!emptySelection &&
                <Box sx={containerStyle}>
                    {singleNodeSelected ?
                        <SingleNodeToolbar node={selectedNodes[0]} /> :
                        <DefaultToolbar selectedEdges={selectedEdges} selectedNodes={selectedNodes} />}
                </Box>}
        </AnimatePresence>
    )
}


function SingleNodeToolbar({ node }) {

    const rf = useReactFlow()

    const [data, setData] = useNodeData(node.id)
    const displayProps = useNodeDisplayProps(node.id)
    const nodeType = useNodeType({ type: node.type })

    const hasConfiguration = !!nodeType.configuration

    // re-render when node changes 
    useStore(s => Object.fromEntries(s.nodeInternals)[node.id]?.data)

    // animation stuff
    const underScreen = { y: 40 }
    const fullyExpanded = { y: "calc(-100% - 40px)" }
    const partiallyExpanded = { y: -100 }

    // use ref to get configuration height
    const configRef = useRef()
    const configHeight = configRef.current?.offsetHeight ?? 0

    // focus on node when expanded
    useEffect(() => {
        data?.expanded && rf.fitBounds({
            x: node.position.x,
            y: node.position.y + (configHeight > 160 ? configHeight * 0.3 : 0),
            width: node.width,
            height: node.height,
        }, {
            duration: 200,
        })
    }, [data?.focused])

    // expand and close node on scroll
    const handleWheel = event => {
        if(event.deltaY != 0)
            setData({ expanded: event.deltaY > 0 })
    }

    return (
        <motion.div
            initial={underScreen}
            animate={!hasConfiguration || data?.expanded ? fullyExpanded : partiallyExpanded}
            exit={underScreen}
            key={node.id}
        >
            <Stack align="center" onWheel={handleWheel}>
                <ToolbarCard>
                    <Group spacing="xs">
                        <nodeType.icon />
                        <Text>{nodeType.name}</Text>
                        {/* <Tooltip label="View Guides">
                            <ActionIcon size="lg" radius="md"><TbBooks fontSize={22} /></ActionIcon>
                        </Tooltip> */}
                        <Tooltip label="Configure Node">
                            <ActionIcon size="lg" radius="md" onClick={() => setData({ expanded: true })}>
                                <TbAdjustments fontSize={22} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <Divider orientation="vertical" />
                    <Group spacing={5}>
                        {node.deletable !== false &&
                            <DeleteButton nodes={[node]} edges={[]} label="Node" />}
                    </Group>
                </ToolbarCard>

                {hasConfiguration &&
                    <Card
                        shadow="md"
                        radius="xl"
                        px="xl"
                        onClick={() => setData({ expanded: true })}
                        miw="100%"
                        sx={{ overflow: "visible" }}
                    >
                        <Center ref={configRef}>
                            {rf.getNode(node.id) &&
                                <nodeType.configuration {...displayProps} />}
                        </Center>
                    </Card>}
            </Stack>
        </motion.div>
    )
}


function DefaultToolbar({ selectedNodes, selectedEdges }) {
    return (
        <motion.div initial={{ y: 40 }} animate={{ y: "calc(-100% - 40px)" }} exit={{ y: 40 }} key="multi">
            <ToolbarCard>
                <Group spacing={5}>
                    <DeleteButton nodes={selectedNodes} edges={selectedEdges} disabled={selectedNodes.some(node => node.deletable === false)} />
                </Group>
            </ToolbarCard>
        </motion.div>
    )
}


function ToolbarCard({ children }) {
    return (
        <Card
            px="xl"
            py="xs"
            shadow="md"
            withBorder={false}
            sx={cardStyle}
        >
            <Group spacing="lg">
                {children}
            </Group>
        </Card>
    )
}


function DeleteButton({ nodes, edges, label, ...props }) {

    const reactFlow = useReactFlow()

    const handleClick = () => {
        edges.length && removeEdges(edges.map(e => e.id), reactFlow)
        nodes.length && removeNodes(nodes.map(n => n.id), reactFlow)
    }

    return (
        <Tooltip label={label ? `Remove ${label}` : "Remove"}>
            <ActionIcon color="red" size="lg" radius="md" onClick={handleClick} {...props}>
                <TbTrash fontSize={22} />
            </ActionIcon>
        </Tooltip>
    )
}


const cardStyle = theme => ({
    borderRadius: "100vw",
    overflow: "visible",
})

const containerStyle = theme => ({
    position: "absolute",
    // bottom: 40,
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
})