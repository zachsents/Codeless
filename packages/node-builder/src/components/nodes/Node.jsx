import { DataType } from "../../dataTypes"
import { Position } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { Card, Text, Flex, Group, Stack, Modal, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import CustomHandle from "./CustomHandle"
import { useNodeState } from "../../util"


export default function Node(props) {

    const { nodeTypes } = useNodeBuilder()
    const nodeType = nodeTypes[props.type]

    // node's interal state
    const [state, setState] = useNodeState(props.id)

    // modal state
    const [modalOpened, modalHandlers] = useDisclosure(false)

    // small size
    const small = nodeType.sm ?
        <nodeType.sm state={state} setState={setState} /> :
        <nodeType.icon />

    // medium size
    const med = nodeType.md ?
        <nodeType.md state={state} setState={setState} /> :
        <Group>
            <nodeType.icon />
            <Text>{nodeType.name}</Text>
        </Group>

    // large size
    const large = nodeType.lg ?
        <nodeType.lg state={state} setState={setState} /> :
        <Group>
            <nodeType.icon />
            <Text>{nodeType.name}</Text>
        </Group>

    const [size, setSize] = useState("sm")
    const displayComponent = size == "sm" ? small : size == "md" ? med : large

    return (
        <>
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
                shadow="sm"
                onDoubleClick={modalHandlers.open}
            // sx={{ overflow: "visible" }}
            >
                <Flex>
                    {displayComponent}
                </Flex>
            </Card>

            {nodeType.options &&
                <Modal
                    title={<Title order={4}>{nodeType.name}</Title>}
                    centered
                    overlayOpacity={0.2}
                    opened={modalOpened}
                    onClose={modalHandlers.close}
                >
                    <nodeType.options state={state} setState={setState} />
                </Modal>}
        </>
    )
}

function HandleStack({ children, position }) {
    return (
        <Stack justify="space-evenly" align="center" spacing={0} sx={stackStyle(position)}>
            {children}
        </Stack>
    )
}


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