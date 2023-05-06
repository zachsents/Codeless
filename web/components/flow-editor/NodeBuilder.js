import { useMantineTheme } from "@mantine/core"
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

import { useStoreProperty } from "@minus/client-nodes/hooks/nodes"
import 'reactflow/dist/style.css'
import PaneContextMenu from "./PaneContextMenu"
import ReplayPanel from "./run-replay/ReplayPanel"


export default function NodeBuilder() {

    const theme = useMantineTheme()

    const { flowGraph, setDirty } = useFlowContext()
    const _updateFlowGraph = useUpdateFlowGraph(flowGraph?.id)
    const updateFlowGraph = async (...args) => {
        await _updateFlowGraph(...args)
        setDirty(false)
    }

    // deserialize graph
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => deserializeGraph(flowGraph?.graph),
        [flowGraph?.graph]
    )

    // debounce graph changes and update flow document
    const [, _setGraph] = useDebouncedCustomState(flowGraph?.graph, updateFlowGraph, 1000, {
        onNoUpdate: () => setDirty(false),
    })
    const setGraph = (...args) => {
        _setGraph(...args)
        setDirty(true)
    }

    // watch shift key tp enable snapping
    // const shiftPressed = useKeyPress("Shift")

    // pane context menu
    const [, setPaneContextMenuOpened] = useStoreProperty("paneContextMenu")
    const handlePaneContextMenu = event => {
        event.preventDefault()
        const nodeEditorEl = document.getElementById("node-editor").getBoundingClientRect()
        setPaneContextMenuOpened({
            x: event.clientX - nodeEditorEl.x,
            y: event.clientY - nodeEditorEl.y,
            opened: true,
        })
    }

    return flowGraph ?
        <ReactFlow
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultNodes={initialNodes}
            defaultEdges={initialEdges}
            defaultEdgeOptions={valueEdgeProps}
            fitView

            connectOnClick={false}
            snapGrid={[25, 25]}
            // snapToGrid={true}
            // snapToGrid={shiftPressed}

            elevateNodesOnSelect

            // This switches whether onMouseDown or onClick is used
            selectNodesOnDrag={false}
            onPaneContextMenu={handlePaneContextMenu}

            selectionKeyCode={"Control"}
            multiSelectionKeyCode={"Shift"}
            zoomActivationKeyCode={null}
            deleteKeyCode={deleteKeyCodes}

            id="node-editor"
        >
            <Background
                variant="lines"
                gap={25}
                size={1}
                color={theme.colors.gray[0]}

            // color="transparent"
            // style={{
            //     // backgroundColor: app?.theme?.editorBackgroundColor ?? theme.colors.gray[2],
            //     backgroundColor: "white",
            // }}
            />
            {/* <Toolbar /> */}
            <ReplayPanel />
            <PaneContextMenu />

            <ChangeWatcher onChange={setGraph} />
            <Cleaner />
        </ReactFlow>
        :
        <></>
}


function ChangeWatcher({ onChange }) {

    const nodes = useNodes()
    const edges = useEdges()

    const [debouncedNodes] = useDebouncedValue(JSON.stringify(nodes), 200)
    const [debouncedEdges] = useDebouncedValue(JSON.stringify(edges), 200)

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
