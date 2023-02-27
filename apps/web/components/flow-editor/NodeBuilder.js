import { useEffect, useMemo } from "react"
import ReactFlow, { Background, useNodes, useEdges, useKeyPress } from "reactflow"
import { useMantineTheme } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import { useUpdateFlowGraph } from "@minus/client-sdk"

import { serializeGraph, deserializeGraph } from "@minus/graph-util"
import { useDebouncedCustomState } from "../../modules/hooks"
import { useAppContext, useFlowContext } from "../../modules/context"
import { Nodes } from "../../modules/nodes"
import Node from "./Node"
import DataEdge from "./DataEdge"
import Toolbar from "./Toolbar"
import ConfigPanel from "./config-panel/ConfigPanel"

import 'reactflow/dist/style.css'


export default function NodeBuilder() {

    const theme = useMantineTheme()

    const { app } = useAppContext()
    const { flowGraph } = useFlowContext()
    const updateFlowGraph = useUpdateFlowGraph(flowGraph?.id)

    // deserialize graph
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => deserializeGraph(flowGraph?.graph),
        [flowGraph?.graph]
    )

    // debounce graph changes and update flow document
    const [, setGraph] = useDebouncedCustomState(flowGraph?.graph, updateFlowGraph, 1000)

    // watch shift key tp enable snapping
    const shiftPressed = useKeyPress("Shift")

    return flowGraph ?
        <ReactFlow
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultNodes={initialNodes}
            defaultEdges={initialEdges}
            elevateNodesOnSelect
            defaultEdgeOptions={valueEdgeProps}
            fitView
            snapGrid={[20, 20]}
            snapToGrid={shiftPressed}

            // connectionLineType="smoothstep"

            selectionKeyCode={"Shift"}
            multiSelectionKeyCode={"Shift"}
            zoomActivationKeyCode={null}
            deleteKeyCode={deleteKeyCodes}
        >
            <Background
                // variant="lines" 
                gap={40}
                size={1}
                color="transparent"
                style={{
                    backgroundColor: app?.theme?.editorBackgroundColor ?? theme.colors.gray[2],
                }}
            />
            <Toolbar />
            <ConfigPanel />
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

const deleteKeyCodes = ["Delete", "Backspace"]

const nodeTypes = Object.fromEntries(
    Object.keys(Nodes).map(type => [type, Node])
)

const edgeTypes = {
    dataEdge: DataEdge,
}

const valueEdgeProps = {
    // type: "smoothstep",
    focusable: false,
    type: "dataEdge",
    // pathOptions: {
    //     borderRadius: 30,
    // },
}

// const signalEdgeProps = theme => ({
//     // type: "smoothstep",
//     animated: true,
//     focusable: false,
//     // pathOptions: {
//     //     borderRadius: 20,
//     // },
//     // markerEnd: {
//     //     type: MarkerType.ArrowClosed,
//     //     width: 20,
//     //     height: 20,
//     //     color: theme.colors.dark[5]
//     // },
//     style: {
//         stroke: theme.colors.dark[5],
//     }
// })
