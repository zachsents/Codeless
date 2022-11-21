import { useMemo, useState } from "react"
import { Card, Flex, Stack, Box, ActionIcon, useMantineTheme } from "@mantine/core"
import { useDisclosure, useHover } from "@mantine/hooks"
import { getConnectedEdges, Position, useReactFlow } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { DataType } from "../../modules/dataTypes"
import CustomHandle from "./CustomHandle"
import { Handle, useNodeState } from "../../util"
import { TbAdjustmentsAlt, TbChecks, TbMinimize, TbMinus, TbPlus } from "react-icons/tb"
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion"


export default function Node({ id, type, selected }) {

    const theme = useMantineTheme()
    const rf = useReactFlow()

    // get node type
    const { nodeTypes, flowId, appId } = useNodeBuilder()
    const nodeType = nodeTypes[type]

    // node's interal state
    const [state, setState] = useNodeState(id)

    // expanding nodes
    const canBeExpanded = !!nodeType.expanded

    // pass connection state to node
    const connections = useMemo(() => {
        // find connected edges
        const connectedEdges = getConnectedEdges([rf.getNode(id)], rf.getEdges())
            .map(edge => new Handle(edge.targetHandle).name)
        
        // create a map of value target handles to connection state
        const entries = nodeType.valueTargets?.map(vt => [vt, connectedEdges.includes(vt)])
        return entries ? Object.fromEntries(entries) : {}
    }, [JSON.stringify(rf.getEdges())])

    // props for display components
    const displayProps = {
        state,
        setState,
        flowId,
        appId,
        connections,
    }

    // hover for showing expand button
    const { hovered, ref } = useHover()

    // Card Flip animation -- will be added back in during animation overhaul
    // const variants = {
    //     expanded: {
    //         rotateY: 180,
    //         transition: { duration: .2 },
    //     },

    //     notExpanded: {
    //         rotateY: 0,
    //         transition: { duration: .2 }
    //     }
    // }

    return (
        <Box
            style={{ transition: "all 0.3s" }}
            sx={selected && { transform: "scale(1.1)" }}
            ref={ref}
            onClick={() => console.log(connections)}
        >
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

            {/* This looks cool, but needs some work. Saving it for the animation overhaul. */}
            {/* <motion.div variants={variants} animate={size == Size.Large ? "expanded" : "notExpanded"}> */}
            <Card
                radius="lg"
                p="md"
                shadow={selected ? "lg" : "sm"}
                sx={cardStyle(id)}
            >
                <Flex>
                    {state.expanded ?
                        <nodeType.expanded {...displayProps} />
                        :
                        nodeType.default ?
                            <nodeType.default {...displayProps} />
                            :
                            <nodeType.icon />}
                </Flex>
            </Card>
            {/* </motion.div> */}

            {canBeExpanded && <ExpandButton
                show={hovered}
                expanded={state.expanded}
                onExpand={() => setState({ expanded: true })}
                onCollapse={() => setState({ expanded: false })}
            />}
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

function ExpandButton({ show = false, expanded = false, onExpand, onCollapse }) {

    const theme = useMantineTheme()

    return (
        <Box
            sx={{
                position: "absolute",
                top: -theme.spacing.sm,
                right: -theme.spacing.sm,
                zIndex: 11,
            }}
        >
            <AnimatePresence>
                {show &&
                    <motion.div initial={{ scale: 0, rotate: -135 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -135 }} transition={{ duration: 0.1 }}>
                        <ActionIcon
                            // size="xs"
                            radius="xl"
                            variant="filled"
                            color="indigo.8"
                            onClick={() => (expanded ? onCollapse : onExpand)?.()}
                        >
                            {expanded ? <TbMinus /> : <TbPlus />}
                        </ActionIcon>
                    </motion.div>
                }
            </AnimatePresence>
        </Box>
    )
}

const cardStyle = (id, flip = false) => theme => ({
    overflow: "visible",
    backgroundColor: id == "trigger" && theme.colors.yellow[5],
    // ...(flip && {
    //     transform: "scaleX(-1)",
    // })
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
