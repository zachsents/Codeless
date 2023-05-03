import { useDebouncedValue } from "@mantine/hooks"
import { useUpdateFlowGraph } from "@minus/client-sdk"
import { useEffect, useMemo } from "react"
import ReactFlow, { Background, useEdges, useNodes } from "reactflow"

import { NodeDefinitions } from "@minus/client-nodes"
import { useFlowContext } from "@web/modules/context"
import { deserializeGraph, serializeGraph } from "@web/modules/graph-util"
import { useCleanGhostEdgesEffect, useDebouncedCustomState } from "@web/modules/hooks"
import DataEdge from "./DataEdge"
import Node from "./node/Node"

import 'reactflow/dist/style.css'
import ReplayPanel from "./run-replay/ReplayPanel"


export default function NodeBuilder() {

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
    // const shiftPressed = useKeyPress("Shift")

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
            // snapToGrid={shiftPressed}
            connectOnClick={false}

            // connectionLineType="smoothstep"

            selectionKeyCode={"Alt"}
            multiSelectionKeyCode={"Alt"}
            zoomActivationKeyCode={null}
            deleteKeyCode={deleteKeyCodes}

            id="node-editor"
        >
            <Background
                variant="lines"
                gap={40}
                size={1}
            // color="transparent"
            // style={{
            //     // backgroundColor: app?.theme?.editorBackgroundColor ?? theme.colors.gray[2],
            //     backgroundColor: "white",
            // }}
            />
            {/* <Toolbar /> */}
            <ReplayPanel />

            <ChangeWatcher onChange={setGraph} />
            <Cleaner />
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


function Cleaner() {
    useCleanGhostEdgesEffect()
    return <></>
}

const deleteKeyCodes = ["Delete", "Backspace"]

const nodeTypes = Object.fromEntries(
    Object.keys(NodeDefinitions).map(type => [type, Node])
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