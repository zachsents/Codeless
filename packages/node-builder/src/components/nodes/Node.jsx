import NodeTypes from "../../modules/nodeTypes"
import { DataType } from "../../dataTypes"
import NodeInner from "./NodeInner"
import HandleGroup from "./HandleGroup"
import { Position } from "react-flow-renderer"
import * as displayOverrides from "./displayOverrides"


export default function Node(props) {

    const nodeType = NodeTypes[props.type]

    return (
        <>
            <HandleGroup
                position={Position.Left}
                type="target"
                handles={[
                    ...createHandleData(nodeType.targets?.values, DataType.Value),
                    ...createHandleData(nodeType.targets?.signals, DataType.Signal),
                ]}
            />
            <HandleGroup
                position={Position.Right}
                type="source"
                handles={[
                    ...createHandleData(nodeType.sources?.values, DataType.Value),
                    ...createHandleData(nodeType.sources?.signals, DataType.Signal),
                ]}
            />

            <NodeInner
                label={nodeType.name}
                {...props}
                displayOverride={displayOverrides[props.type]}
            />
        </>
    )
}

function createHandleData(collection, dataType) {
    return collection ? Object.keys(collection).map(item => ({
        name: item,
        dataType
    })) : []
}