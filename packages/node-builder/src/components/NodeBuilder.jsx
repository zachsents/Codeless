import { useCallback, useState } from "react"
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, Controls, MiniMap, updateEdge } from "react-flow-renderer"
import { validateEdgeConnection } from "../util"
import DeletableEdge from "./DeletableEdge"
import Search from "./search/Search"

import NodeTypes from "../modules/nodeTypes"
import Node from "./nodes/Node"
import Execution from "./execution/Execution"


const nodeTypes = Object.fromEntries(
    Object.keys(NodeTypes).map(type => [ type, Node ])
)

const edgeTypes = {
    deletable: DeletableEdge
}


export default function NodeBuilder() {

    const [nodes, setNodes] = useState([
        {
            "width": 150,
            "height": 63,
            "id": "Interval_tEgyADAwdSjExKXR56iHEc",
            "type": "Interval",
            "data": {
                "state": {}
            },
            "position": {
                "x": -48,
                "y": 4
            },
            "positionAbsolute": {
                "x": -48,
                "y": 4
            },
            "selected": false,
            "dragging": false
        },
        {
            "width": 122,
            "height": 64,
            "id": "Number_hok8d85Ea1M1XDR9DMSe7Q",
            "type": "Number",
            "data": {
                "state": {
                    "$": 2000
                }
            },
            "position": {
                "x": -220,
                "y": 4
            },
            "positionAbsolute": {
                "x": -220,
                "y": 4
            },
            "selected": false,
            "dragging": false
        },
        {
            "width": 179,
            "height": 63,
            "id": "Variable_7ZRCXr6MENRZCBYcXKRY5Y",
            "type": "Variable",
            "data": {
                "state": {}
            },
            "position": {
                "x": 204.99999999999997,
                "y": -76
            },
            "selected": false,
            "positionAbsolute": {
                "x": 204.99999999999997,
                "y": -76
            },
            "dragging": false
        },
        {
            "width": 122,
            "height": 64,
            "id": "Number_icybHiZ6Y78banZchDsQ6C",
            "type": "Number",
            "data": {
                "state": {
                    "$": 0
                }
            },
            "position": {
                "x": -18,
                "y": -109.99999999999997
            },
            "positionAbsolute": {
                "x": -18,
                "y": -109.99999999999997
            },
            "selected": false,
            "dragging": false
        },
        {
            "width": 140,
            "height": 63,
            "id": "Bind_oryi8yPRPu7RjzpoaZsqsx",
            "type": "Bind",
            "data": {
                "state": {}
            },
            "position": {
                "x": 483,
                "y": 14
            },
            "selected": false,
            "positionAbsolute": {
                "x": 483,
                "y": 14
            },
            "dragging": false
        },
        {
            "width": 140,
            "height": 63,
            "id": "Bind_doCk6zgTeuMJdsKtoaj6ge",
            "type": "Bind",
            "data": {
                "state": {}
            },
            "position": {
                "x": 620.9999999999999,
                "y": -141
            },
            "selected": false,
            "positionAbsolute": {
                "x": 620.9999999999999,
                "y": -141
            },
            "dragging": false
        },
        {
            "width": 122,
            "height": 64,
            "id": "Number_6wFsaNVZHKJ6NsKomQ3noR",
            "type": "Number",
            "data": {
                "state": {
                    "$": 1
                }
            },
            "position": {
                "x": 235.99999999999994,
                "y": -172.99999999999997
            },
            "positionAbsolute": {
                "x": 235.99999999999994,
                "y": -172.99999999999997
            },
            "selected": false,
            "dragging": false
        },
        {
            "width": 131,
            "height": 63,
            "id": "Sum_gp6Fy5KbGFrmkC9B43J2MF",
            "type": "Sum",
            "data": {
                "state": {}
            },
            "position": {
                "x": 425.9999999999999,
                "y": -152.99999999999997
            },
            "selected": false,
            "positionAbsolute": {
                "x": 425.9999999999999,
                "y": -152.99999999999997
            },
            "dragging": false
        },
        {
            "id": "Log_jGoyiwboFo2h1UZ6hGuSK3",
            "type": "Log",
            "data": {
                "state": {}
            },
            "position": {
                "x": 662.9999999999999,
                "y": 7
            },
            "width": 131,
            "height": 63,
            "selected": false,
            "positionAbsolute": {
                "x": 662.9999999999999,
                "y": 7
            },
            "dragging": false
        }
    ])
    const [edges, setEdges] = useState([
        {
            "source": "Number_hok8d85Ea1M1XDR9DMSe7Q",
            "sourceHandle": "<value> ",
            "target": "Interval_tEgyADAwdSjExKXR56iHEc",
            "targetHandle": "<value>period",
            "type": "deletable",
            "id": "reactflow__edge-Number_hok8d85Ea1M1XDR9DMSe7Q<value> -Interval_tEgyADAwdSjExKXR56iHEc<value>period"
        },
        {
            "source": "Number_icybHiZ6Y78banZchDsQ6C",
            "sourceHandle": "<value> ",
            "target": "Variable_7ZRCXr6MENRZCBYcXKRY5Y",
            "targetHandle": "<value>initial",
            "type": "deletable",
            "id": "reactflow__edge-Number_icybHiZ6Y78banZchDsQ6C<value> -Variable_7ZRCXr6MENRZCBYcXKRY5Y<value>initial"
        },
        {
            "source": "Variable_7ZRCXr6MENRZCBYcXKRY5Y",
            "sourceHandle": "<value>current",
            "target": "Bind_oryi8yPRPu7RjzpoaZsqsx",
            "targetHandle": "<value>value",
            "type": "deletable",
            "id": "reactflow__edge-Variable_7ZRCXr6MENRZCBYcXKRY5Y<value>current-Bind_oryi8yPRPu7RjzpoaZsqsx<value>value"
        },
        {
            "source": "Number_6wFsaNVZHKJ6NsKomQ3noR",
            "sourceHandle": "<value> ",
            "target": "Sum_gp6Fy5KbGFrmkC9B43J2MF",
            "targetHandle": "<value>in",
            "type": "deletable",
            "id": "reactflow__edge-Number_6wFsaNVZHKJ6NsKomQ3noR<value> -Sum_gp6Fy5KbGFrmkC9B43J2MF<value>in"
        },
        {
            "source": "Variable_7ZRCXr6MENRZCBYcXKRY5Y",
            "sourceHandle": "<value>current",
            "target": "Sum_gp6Fy5KbGFrmkC9B43J2MF",
            "targetHandle": "<value>in",
            "type": "deletable",
            "id": "reactflow__edge-Variable_7ZRCXr6MENRZCBYcXKRY5Y<value>current-Sum_gp6Fy5KbGFrmkC9B43J2MF<value>in"
        },
        {
            "source": "Sum_gp6Fy5KbGFrmkC9B43J2MF",
            "sourceHandle": "<value>sum",
            "target": "Bind_doCk6zgTeuMJdsKtoaj6ge",
            "targetHandle": "<value>value",
            "type": "deletable",
            "id": "reactflow__edge-Sum_gp6Fy5KbGFrmkC9B43J2MF<value>sum-Bind_doCk6zgTeuMJdsKtoaj6ge<value>value"
        },
        {
            "source": "Interval_tEgyADAwdSjExKXR56iHEc",
            "sourceHandle": "<signal> ",
            "target": "Bind_doCk6zgTeuMJdsKtoaj6ge",
            "targetHandle": "<signal>signal",
            "type": "deletable",
            "id": "reactflow__edge-Interval_tEgyADAwdSjExKXR56iHEc<signal> -Bind_doCk6zgTeuMJdsKtoaj6ge<signal>signal"
        },
        {
            "source": "Bind_doCk6zgTeuMJdsKtoaj6ge",
            "sourceHandle": "<signal>out",
            "target": "Variable_7ZRCXr6MENRZCBYcXKRY5Y",
            "targetHandle": "<signal>set",
            "type": "deletable",
            "id": "reactflow__edge-Bind_doCk6zgTeuMJdsKtoaj6ge<signal>out-Variable_7ZRCXr6MENRZCBYcXKRY5Y<signal>set"
        },
        {
            "source": "Interval_tEgyADAwdSjExKXR56iHEc",
            "sourceHandle": "<signal> ",
            "target": "Bind_oryi8yPRPu7RjzpoaZsqsx",
            "targetHandle": "<signal>signal",
            "type": "deletable",
            "id": "reactflow__edge-Interval_tEgyADAwdSjExKXR56iHEc<signal> -Bind_oryi8yPRPu7RjzpoaZsqsx<signal>signal"
        },
        {
            "source": "Bind_oryi8yPRPu7RjzpoaZsqsx",
            "sourceHandle": "<signal>out",
            "target": "Log_jGoyiwboFo2h1UZ6hGuSK3",
            "targetHandle": "<signal> ",
            "type": "deletable",
            "id": "reactflow__edge-Bind_oryi8yPRPu7RjzpoaZsqsx<signal>out-Log_jGoyiwboFo2h1UZ6hGuSK3<signal> "
        }
    ])

    // console.log(nodes)
    // console.log(edges)

    const onNodesChange = useCallback(
        changes => setNodes(nodes => applyNodeChanges(changes, nodes)),
        [setNodes]
    )

    const onEdgesChange = useCallback(
        changes => setEdges(edges => applyEdgeChanges(changes, edges)),
        [setEdges]
    )

    const removeEdge = id => setEdges(edges => edges.filter(e => e.id != id))

    const onConnect = useCallback(
        connection => validateEdgeConnection(connection, edges) &&
            setEdges(edges => addEdge({
                ...connection,
                type: "deletable",
            }, edges)),
        [edges]
    )

    const onEdgeUpdate = useCallback(
        (oldEdge, newConnection) => validateEdgeConnection(newConnection, edges) &&
            setEdges(edges => updateEdge(oldEdge, newConnection, edges)),
        [edges]
    )

    return (
        <>
            <ReactFlow
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeUpdate={onEdgeUpdate}
                fitView
            >
                <MiniMap />
                <Controls />
                <Search />
                {/* <Execution /> */}
            </ReactFlow>
        </>
    )
}
