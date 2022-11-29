import { useCallback, createContext, useContext, useMemo } from "react"
import ReactFlow, { useNodesState, useEdgesState, Background, addEdge, MarkerType, updateEdge, useReactFlow, useNodes, useEdges, useStore, applyEdgeChanges } from "reactflow"
import { useMantineTheme } from "@mantine/core"

import { findEdgeFromConnection, validateEdgeConnection } from "../util"
import Node from "./nodes/Node"

import 'reactflow/dist/style.css'
import "../nodeStyles.css"
import { DataType } from "../modules/dataTypes"
import { useEffect } from "react"
import ActiveToolbar from "./ActiveToolbar"
import { useDebouncedValue } from "@mantine/hooks"
import produce from "immer"


export default function NodeBuilder({ nodeTypes = {}, initialGraph, onChange, flowId, appId, firestore }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    // put node types into a form RF likes
    const rfNodeTypes = useMemo(() =>
        Object.fromEntries(Object.keys(nodeTypes).map(type => [type, Node])),
        [nodeTypes]
    )

    // deserialize initial state
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => deserializeGraph(initialGraph))

    // handle connection -- validate and style edges 
    const handleConnect = connection => {

        const dataType = validateEdgeConnection(connection, rf.getEdges())

        // edge isn't validated -- remove it
        if (!dataType) {
            rf.setEdges(edges => {
                const newEdge = findEdgeFromConnection(connection, edges)
                return applyEdgeChanges([{ id: newEdge.id, type: "remove" }], edges)
            })
            return
        }

        // apply edge styles based on data type
        const edgeProps = (dataType == DataType.Signal ? signalEdgeProps : valueEdgeProps)(theme)
        rf.setEdges(produce(draft => {
            const newEdge = findEdgeFromConnection(connection, draft)
            Object.entries(edgeProps)
                .forEach(([key, val]) => newEdge[key] = val)
        }))
    }


    return (
        <NodeBuilderContext.Provider value={{ nodeTypes, flowId, appId, firestore }}>
            <ReactFlow
                nodeTypes={rfNodeTypes}
                defaultNodes={initialNodes}
                defaultEdges={initialEdges}
                onConnect={handleConnect}
                // onEdgeUpdate={handleConnect}
                fitView
                // connectionLineType="smoothstep"
                selectionKeyCode={null}
                multiSelectionKeyCode={"Shift"}
                zoomActivationKeyCode={null}
            >
                <Background
                    // variant="lines" 
                    gap={40}
                    size={1}
                    color="transparent"
                    style={{
                        backgroundColor: theme.other.editorBackgroundColor ?? theme.colors.gray[2]
                    }}
                />
                <ChangeWatcher onChange={onChange} />
                <ActiveToolbar />
            </ReactFlow>
        </NodeBuilderContext.Provider>
    )
}

function ChangeWatcher({ onChange }) {

    const nodes = useNodes()
    const edges = useEdges()

    const [debouncedNodes] = useDebouncedValue(nodes, 200)
    const [debouncedEdges] = useDebouncedValue(edges, 200)

    const serialized = useMemo(() => serializeGraph(nodes, edges), [debouncedNodes, debouncedEdges])

    useEffect(() => {
        onChange?.(serialized)
        // console.log(nodes.length, edges.length)
    }, [serialized])

    return <></>
}


const NodeBuilderContext = createContext()

export function useNodeBuilder() {
    return useContext(NodeBuilderContext)
}


const valueEdgeProps = theme => ({
    // type: "smoothstep",
    focusable: false,
    // pathOptions: {
    //     borderRadius: 30,
    // },
})

const signalEdgeProps = theme => ({
    // type: "smoothstep",
    animated: true,
    focusable: false,
    // pathOptions: {
    //     borderRadius: 20,
    // },
    // markerEnd: {
    //     type: MarkerType.ArrowClosed,
    //     width: 20,
    //     height: 20,
    //     color: theme.colors.dark[5]
    // },
    style: {
        stroke: theme.colors.dark[5],
    }
})


export function serializeGraph(nodes = [], edges = []) {
    return JSON.stringify({
        nodes: nodes.map(node => ({ ...node, state: node.data.state, })), 
        edges
    })
}

function deserializeGraph(str = "{}") {
    const { nodes, edges } = JSON.parse(str)
    return { nodes, edges }
}