import { forwardRef, useState } from "react"
import { Card, Group, Flex, Stack, Portal, Text, Box, ActionIcon, useMantineTheme, ThemeIcon } from "@mantine/core"
import { useClickOutside, useHover, useInterval } from "@mantine/hooks"
import { Position, useUpdateNodeInternals } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { DataType } from "../../modules/dataTypes"
import CustomHandle from "./CustomHandle"
import { useNodeData, useNodeDisplayProps } from "../../util"
import { TbMinus, TbPlus } from "react-icons/tb"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { useRef } from "react"


export default function Node({ id, type, selected }) {

    // get node type
    const { nodeTypes } = useNodeBuilder()
    const nodeType = nodeTypes[type]

    // node's interal state & data
    const [data, setData] = useNodeData(id)

    // props for display components
    const displayProps = useNodeDisplayProps(id)

    // expanding nodes
    const canBeExpanded = !!nodeType.configuration
    // when deselected, close node
    useEffect(() => {
        !selected && setData({ expanded: false, focused: false })
    }, [selected])

    // hover for showing expand button
    // const { hovered, ref: hoverRef } = useHover()

    // smoothly updating edge positions
    const updateNodeInterals = useUpdateNodeInternals()
    const nodeUpdateInterval = useInterval(() => {
        updateNodeInterals(id)
    }, 20)
    useEffect(() => {
        nodeUpdateInterval.start()
    }, [selected])

    // calculating min height for stacks
    const leftStackRef = useRef()
    const rightStackRef = useRef()
    const stackHeight = Math.max(
        leftStackRef.current?.offsetHeight ?? 0,
        rightStackRef.current?.offsetHeight ?? 0
    )

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: selected ? 1.1 : 1, }}
            onAnimationComplete={nodeUpdateInterval.stop}
        >
            <HandleStack position={Position.Left} ref={leftStackRef}>
                {nodeType.valueTargets?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Value} handleType="target" position={Position.Left} key={name} />
                )}
                {nodeType.signalTargets?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Signal} handleType="target" position={Position.Left} key={name} />
                )}
            </HandleStack>

            <HandleStack position={Position.Right} ref={rightStackRef}>
                {nodeType.valueSources?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Value} handleType="source" position={Position.Right} key={name} />
                )}
                {nodeType.signalSources?.map(name =>
                    <CustomHandle name={name} dataType={DataType.Signal} handleType="source" position={Position.Right} key={name} />
                )}
            </HandleStack>

            <Card
                radius="md"
                p="sm"
                px="md"
                shadow={selected ? "lg" : "sm"}
                mih={stackHeight}
                sx={cardStyle(id)}
                onDoubleClick={() => setData({ expanded: true, focused: true })}
            >
                <Flex>
                    {nodeType.renderNode ?
                        <>
                            <nodeType.renderNode {...displayProps} />
                            <ThemeIcon color={nodeType.color ?? "yellow.5"} radius="md" size="sm" sx={topIconStyle(10)}>
                                <nodeType.icon size={12} color="black" />
                            </ThemeIcon>
                        </>
                        :
                        <Group spacing="xs">
                            {nodeType.color ?
                                <ThemeIcon color={nodeType.color} size="sm" radius="xl">
                                    <nodeType.icon size={10} />
                                </ThemeIcon>
                                :
                                <nodeType.icon size={16} />
                            }
                            <Box maw={120}>
                                <Text lh={1.2} size="xs" ff="DM Sans">{nodeType.renderName?.(displayProps) ?? nodeType.name}</Text>
                            </Box>
                        </Group>}
                </Flex>
            </Card>

            {/* {canBeExpanded && <ExpandButton
                show={hovered}
                expanded={data.expanded}
                onExpand={() => setData({ expanded: true })}
                onCollapse={() => setData({ expanded: false })}
            />} */}
        </motion.div>
    )
}

const HandleStack = forwardRef(({ children, position, ...props }, ref) => {
    return (
        <Stack
            justify="space-evenly"
            align="center"
            spacing={0}
            sx={stackStyle(position)}
            ref={ref}
            {...props}
        >
            {children}
        </Stack>
    )
})


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


const cardStyle = id => theme => ({
    overflow: "visible",
    display: "flex",
    backgroundColor: id == "trigger" && theme.colors.yellow[5],
})

const stackStyle = position => ({
    position: "absolute",
    top: "50%",
    zIndex: 10,

    ...(position == Position.Left && {
        left: 0,
        transform: "translate(-50%, -50%)",
    }),
    ...(position == Position.Right && {
        right: 0,
        transform: "translate(50%, -50%)",
    }),
})

const topIconStyle = (offset = 16) => theme => ({
    position: "absolute",
    top: -offset,
    left: "50%",
    transform: "translateX(-50%)",
    width: 40,
})