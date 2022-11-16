import { useCallback, createContext, useContext, useMemo } from "react"
import ReactFlow, { useNodesState, useEdgesState, Background, MiniMap, Controls, addEdge, MarkerType } from "reactflow"
import { useMantineTheme } from "@mantine/core"

import { validateEdgeConnection } from "../util"
import Node from "./nodes/Node"
import DeletableEdge from "./DeletableEdge"
import Search from "./search/Search"
import Execution from "./execution/Execution"

import 'reactflow/dist/style.css'
import "../nodeStyles.css"
import { DataType } from "../dataTypes"


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

    const onConnect = useCallback(
        params => {
            const dataType = validateEdgeConnection(params, edges)

            if (!dataType)
                return

            setEdges(edges => addEdge(
                {
                    ...params,
                    type: "smoothstep",
                    ...(dataType == DataType.Value && valueEdgeProps(theme)),
                    ...(dataType == DataType.Signal && signalEdgeProps(theme)),
                },
                edges
            ))
        },
        [setEdges]
    )

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
                    style={{
                        backgroundColor: theme.other.editorBackgroundColor
                    }}
                />
            </ReactFlow>
        </NodeBuilderContext.Provider>
    )
}

const NodeBuilderContext = createContext()

export function useNodeBuilder() {
    return useContext(NodeBuilderContext)
}


const valueEdgeProps = theme => ({
    animated: false,
    // markerEnd: {
    //     type: MarkerType.ArrowClosed,
    //     width: 20,
    //     height: 20,
    //     color: theme.colors.dark[5]
    // },
    // style: {
    //     stroke: theme.colors.dark[5],
    // }
})

const signalEdgeProps = theme => ({
    animated: true,
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: theme.colors.dark[5]
    },
    style: {
        stroke: theme.colors.dark[5],
    }
})