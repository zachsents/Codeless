import { useCallback, createContext, useContext, useMemo } from "react"

import ReactFlow, { useNodesState, useEdgesState, Background } from "reactflow"
import { validateEdgeConnection } from "../util"
import Node from "./nodes/Node"
import DeletableEdge from "./DeletableEdge"
import Search from "./search/Search"
import Execution from "./execution/Execution"

import 'reactflow/dist/style.css'
import { useMantineTheme } from "@mantine/core"


// const nodeTypes = Object.fromEntries(
//     Object.keys(NodeTypes).map(type => [type, Node])
// )

const edgeTypes = {
    deletable: DeletableEdge
}


export default function NodeBuilder({ nodeTypes = {} }) {

    const theme = useMantineTheme()

    const rfNodeTypes = useMemo(() =>
        Object.fromEntries(Object.keys(nodeTypes).map(type => [type, Node])),
        [nodeTypes]
    )

    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const removeEdge = id => setEdges(edges => edges.filter(e => e.id != id))

    // const onConnect = useCallback(
    //     connection => validateEdgeConnection(connection, edges) &&
    //         setEdges(edges => addEdge({
    //             ...connection,
    //             type: "deletable",
    //         }, edges)),
    //     [edges]
    // )

    const onConnect = useCallback(params => setEdges(edges => addEdge(params, edges)), [setEdges])

    // const onEdgeUpdate = useCallback(
    //     (oldEdge, newConnection) => validateEdgeConnection(newConnection, edges) &&
    //         setEdges(edges => updateEdge(oldEdge, newConnection, edges)),
    //     [edges]
    // )

    return (
        <NodeBuilderContext.Provider value={{ nodeTypes }}>
            <ReactFlow
                nodeTypes={rfNodeTypes}
                // edgeTypes={edgeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            // onEdgeUpdate={onEdgeUpdate}
            // fitView
            >
                {/* <MiniMap /> */}
                {/* <Controls /> */}
                {/* <Search /> */}
                {/* <Execution /> */}
                <Background
                    // variant="lines" 
                    gap={40}
                    size={1}
                    color="transparent"
                    style={{ backgroundColor: theme.colors.indigo[0] }}
                />
            </ReactFlow>
        </NodeBuilderContext.Provider>
    )
}

const NodeBuilderContext = createContext()

export function useNodeBuilder() {
    return useContext(NodeBuilderContext)
}