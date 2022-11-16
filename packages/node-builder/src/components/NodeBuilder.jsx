import { useCallback, createContext, useContext, useMemo } from "react"
import ReactFlow, { useNodesState, useEdgesState, Background, addEdge, MarkerType, updateEdge } from "reactflow"
import { useMantineTheme } from "@mantine/core"

import { validateEdgeConnection } from "../util"
import Node from "./nodes/Node"
import DeletableEdge from "./DeletableEdge"

import 'reactflow/dist/style.css'
import "../nodeStyles.css"
import { DataType } from "../dataTypes"
import { useEffect } from "react"


const edgeTypes = {
    deletable: DeletableEdge
}


export default function NodeBuilder({ nodeTypes = {}, initialGraph, onChange }) {

    const theme = useMantineTheme()

    // deserialize initial state
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => deserializeGraph(initialGraph))

    // put node types into a form RF likes
    const rfNodeTypes = useMemo(() =>
        Object.fromEntries(Object.keys(nodeTypes).map(type => [type, Node])),
        [nodeTypes]
    )

    // node & edge states
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes ?? [])
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ?? [])

    const removeEdge = id => setEdges(edges => edges.filter(e => e.id != id))

    // validate edge on connection
    const onConnect = useCallback(
        params => {
            const dataType = validateEdgeConnection(params, edges)

            if (!dataType)
                return

            setEdges(edges => addEdge(
                {
                    ...params,
                    ...(dataType == DataType.Value && valueEdgeProps(theme)),
                    ...(dataType == DataType.Signal && signalEdgeProps(theme)),
                },
                edges
            ))
        },
        [setEdges]
    )

    // allow reconnecting edges
    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => validateEdgeConnection(newConnection, edges) &&
            setEdges(edges => updateEdge(oldEdge, newConnection, edges)),
        [edges]
    )

    // propagate graph changes to parent
    const serialized = useMemo(() => serializeGraph(nodes, edges), [nodes, edges])
    useEffect(() => {
        onChange?.(serialized)
    }, [serialized])

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
                onEdgeUpdate={onEdgeUpdate}
                fitView
            >
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
    type: "smoothstep",
    // pathOptions: {
    //     borderRadius: 30,
    // },
})

const signalEdgeProps = theme => ({
    type: "smoothstep",
    animated: true,
    // pathOptions: {
    //     borderRadius: 20,
    // },
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


function serializeGraph(nodes, edges) {

    return JSON.stringify({

        nodes: nodes.map(({ id, type, position, data }) => ({
            id,
            type,
            position,
            data,
            state: data?.state ?? {}
        })),

        edges: edges.map(({ id, source, sourceHandle, target, targetHandle, type, animated, style }) => ({
            id, source, sourceHandle, target, targetHandle, type, animated, style
        })),
    })
}

function deserializeGraph(str = "{}") {
    const { nodes, edges } = JSON.parse(str)
    return { nodes, edges }
}