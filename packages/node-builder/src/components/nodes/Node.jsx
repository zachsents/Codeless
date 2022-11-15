import { DataType } from "../../dataTypes"
import NodeInner from "./NodeInner"
import HandleGroup from "./HandleGroup"
import { Position } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { Box, Card, Flex, Group, Text } from "@mantine/core"
import { useState } from "react"


export default function Node(props) {

    const { nodeTypes } = useNodeBuilder()
    const nodeType = nodeTypes[props.type]

    // small size
    const small = nodeType.sm ? <nodeType.sm /> : <nodeType.icon />

    // medium size
    const med = nodeType.md ? <nodeType.md /> :
        <Group>
            <nodeType.icon />
            <Text>{nodeType.name}</Text>
        </Group>

    // large size
    const large = nodeType.lg ? <nodeType.lg /> :
        <Group>
            <nodeType.icon />
            <Text>{nodeType.name}</Text>
        </Group>

    const [size, setSize] = useState("sm")
    const displayComponent = size == "sm" ? small : size == "md" ? med : large

    return (
        <>
            <HandleGroup
                position={Position.Left}
                type="target"
                handles={[
                    // ...createHandleData(nodeType.targets?.values, DataType.Value),
                    // ...createHandleData(nodeType.targets?.signals, DataType.Signal),
                ]}
            />
            <HandleGroup
                position={Position.Right}
                type="source"
                handles={[
                    // ...createHandleData(nodeType.sources?.values, DataType.Value),
                    // ...createHandleData(nodeType.sources?.signals, DataType.Signal),
                ]}
            />

            <Card
                radius="lg"
                p="xl"
                shadow="sm"
            // sx={{ overflow: "visible" }}
            >
                <Flex>
                    {displayComponent}
                </Flex>
            </Card>

            {/* <NodeInner
                label={nodeType.name}
                {...props}
            /> */}
        </>
    )
}

function createHandleData(collection, dataType) {
    return collection ? Object.keys(collection).map(item => ({
        name: item,
        dataType
    })) : []
}