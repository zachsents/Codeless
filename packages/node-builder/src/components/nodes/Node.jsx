import { useState } from "react"
import { Card, Flex, Stack, Box, ActionIcon, useMantineTheme } from "@mantine/core"
import { useDisclosure, useHover } from "@mantine/hooks"
import { Position } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { DataType } from "../../modules/dataTypes"
import CustomHandle from "./CustomHandle"
import { useNodeState } from "../../util"
import { TbAdjustmentsAlt, TbChecks, TbMinimize, TbMinus, TbPlus } from "react-icons/tb"
import { AnimatePresence, motion } from "framer-motion"


export default function Node({ id, type, selected }) {

    const theme = useMantineTheme()

    const { nodeTypes, flowId, appId } = useNodeBuilder()
    const nodeType = nodeTypes[type]

    // node's interal state
    const [state, setState] = useNodeState(id)

    // different sized nodes
    const [size, setSize] = useState(Size.Small)
    const DisplayComponent = nodeType[size] ?? nodeType.default
    const hasLarge = !!nodeType[Size.Large]

    // props for display components
    const displayProps = {
        state,
        setState,
        flowId,
        appId,
    }

    // hover for expanding
    const { hovered, ref } = useHover()

    return (
        <Box style={{ transition: "all 0.3s" }} sx={selected && { transform: "scale(1.2)" }} ref={ref}>
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
                p="md"
                shadow={selected ? "lg" : "sm"}
                sx={cardStyle(id)}
            >
                <Flex>
                    {DisplayComponent ?
                        <DisplayComponent {...displayProps} />
                        :
                        <nodeType.icon />}
                </Flex>

                {/* Expand Button */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -theme.spacing.sm,
                        right: -theme.spacing.sm,
                        zIndex: 11,
                    }}
                >
                    <AnimatePresence>
                        {hovered &&
                            <motion.div initial={{ scale: 0, rotate: -135 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -135 }} transition={{ duration: 0.1 }}>
                                {size == Size.Small && hasLarge && <ActionIcon
                                    // size="xs"
                                    radius="xl"
                                    variant="filled"
                                    color="indigo.8"
                                    onClick={() => setSize(Size.Large)}
                                ><TbPlus /></ActionIcon>}

                                {size == Size.Large && hasLarge && <ActionIcon
                                    // size="xs"
                                    radius="xl"
                                    variant="filled"
                                    color="indigo.8"
                                    onClick={() => setSize(Size.Small)}
                                ><TbMinus /></ActionIcon>}
                            </motion.div>
                        }
                    </AnimatePresence>
                </Box>
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

const cardStyle = id => theme => ({
    overflow: "visible",
    backgroundColor: id == "trigger" && theme.colors.yellow[5],
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

const Size = {
    Small: "sm",
    Medium: "md",
    Large: "lg",
}