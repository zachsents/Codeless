import { DataType } from "../../dataTypes"
import { Position } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { Card, Flex, Stack, Box } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import CustomHandle from "./CustomHandle"
import { useNodeState } from "../../util"


export default function Node({ id, type, selected }) {

    const { nodeTypes, flowId, appId } = useNodeBuilder()
    const nodeType = nodeTypes[type]

    // node's interal state
    const [state, setState] = useNodeState(id)

    // different sized nodes
    const [size, setSize] = useState("lg")
    const DisplayComponent = nodeType[size] ?? nodeType.default

    // props for display components
    const displayProps = {
        state,
        setState,
        flowId,
        appId,
    }

    return (
        <Box style={{ transition: "all 0.3s" }} sx={selected && { transform: "scale(1.2)" }}>
            <HandleStack position={Position.Left}>
                {nodeType.valueTargets?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Value} handleType="target" position={Position.Left} key={name} />
                )}
                {nodeType.signalTargets?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Signal} handleType="target" position={Position.Left} key={name} />
                )}

            </HandleStack>

            <HandleStack position={Position.Right}>
                {nodeType.valueSources?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Value} handleType="source" position={Position.Right} key={name} />
                )}
                {nodeType.signalSources?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Signal} handleType="source" position={Position.Right} key={name} />
                )}
            </HandleStack>

            <Card
                radius="lg"
                p="xl"
                shadow={selected ? "lg" : "sm"}
                sx={cardStyle}
            >
                <Flex>
                    {DisplayComponent ?
                        <DisplayComponent {...displayProps} />
                        :
                        <nodeType.icon />}
                </Flex>
            </Card>
        </Box>
    )
}

function HandleStack({ children, position }) {
    return (
        <Stack justify="space-evenly" align="center" spacing={0} sx={stackStyle(position)}>
            {children}
        </Stack>
    )
}

const cardStyle = theme => ({
    overflow: "visible",
})

const stackStyle = position => ({
    position: "absolute",
    top: "50%",
    zIndex: 10,
    height: "100%",

    ...(position == Position.Left && {
        left: 0,
        transform: "translate(-50%, -50%)",
    }),
    ...(position == Position.Right && {
        right: 0,
        transform: "translate(50%, -50%)",
    }),
})