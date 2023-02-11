import { useEffect, useMemo } from "react"
import produce from "immer"
import ReactFlow, { Background, useReactFlow, useNodes, useEdges } from "reactflow"
import { useMantineTheme } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useUpdateFlowGraph } from "@minus/client-sdk"

import { findEdgeFromConnection, serializeGraph, deserializeGraph } from "../../modules/graph-util"
import { useDebouncedCustomState } from "../../modules/hooks"
import { useFlowContext } from "../../modules/context"
import { Nodes } from "../../modules/nodes"
import Node from "./Node"
import ActiveDetails from "./ActiveDetails"
import DataEdge from "./DataEdge"

import 'reactflow/dist/style.css'


export default function NodeBuilder({ }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    const { flowGraph } = useFlowContext()
    const updateFlowGraph = useUpdateFlowGraph(flowGraph?.id)

    // deserialize graph
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => deserializeGraph(flowGraph?.graph),
        [flowGraph?.graph]
    )

    // debounce graph changes and update
    const [, setGraph] = useDebouncedCustomState(flowGraph?.graph, updateFlowGraph, 1000)

    // handle connection -- validate and style edges 
    const handleConnect = useMemo(() => {
        connection => {
            const edgeProps = valueEdgeProps(theme)
            rf.setEdges(produce(draft => {
                const newEdge = findEdgeFromConnection(connection, draft)
                Object.entries(edgeProps)
                    .forEach(([key, val]) => newEdge[key] = val)
            }))
        }
    }, [rf])


    return flowGraph ?
        <ReactFlow
            nodeTypes={rfNodeTypes}
            edgeTypes={edgeTypes}
            defaultNodes={initialNodes}
            defaultEdges={initialEdges}
            onConnect={handleConnect}
            fitView
            // connectionLineType="smoothstep"
            selectionKeyCode={"Shift"}
            multiSelectionKeyCode={"Shift"}
            zoomActivationKeyCode={null}
            elevateNodesOnSelect
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
            <ActiveDetails />
            <ChangeWatcher onChange={setGraph} />
        </ReactFlow>
        :
        <></>
}


function ChangeWatcher({ onChange }) {

    const nodes = useNodes()
    const edges = useEdges()

    const [debouncedNodes] = useDebouncedValue(nodes, 200)
    const [debouncedEdges] = useDebouncedValue(edges, 200)

    const serialized = useMemo(() => serializeGraph(nodes, edges), [debouncedNodes, debouncedEdges])

    useEffect(() => {
        onChange?.(serialized)
    }, [serialized])

    return <></>
}

const rfNodeTypes = Object.fromEntries(
    Object.keys(Nodes).map(type => [type, Node])
)

const edgeTypes = {
    dataEdge: DataEdge,
}

const valueEdgeProps = theme => ({
    // type: "smoothstep",
    focusable: false,
    type: "dataEdge",
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
