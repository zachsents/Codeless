import { forwardRef, useMemo, useState } from "react"
import { Card, Group, Flex, Stack, Tooltip, Text, Box, ActionIcon, useMantineTheme, ThemeIcon } from "@mantine/core"
import { useClickOutside, useHover, useInterval } from "@mantine/hooks"
import { Position, useKeyPress, useUpdateNodeInternals } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { DataType } from "../../modules/dataTypes"
import CustomHandle from "./CustomHandle"
import { useNodeData, useNodeDisplayProps } from "../../util"
import { TbExclamationMark, TbMinus, TbPlus } from "react-icons/tb"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { useRef } from "react"


export default function Node({ id, type, selected }) {

    // get node type
    const { nodeTypes, lastRun, openSettings } = useNodeBuilder()
    const nodeType = nodeTypes[type]

    // node's interal state & data
    const [data, setData] = useNodeData(id)

    // props for display components
    const displayProps = useNodeDisplayProps(id)

    // when deselected, close node
    useEffect(() => {
        !selected && setData({ expanded: false, focused: false })
    }, [selected])

    // hover for showing handle labels
    const { hovered, ref: hoverRef } = useHover()

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

    // alt-dragging for duplication -- TO DO: implement this
    const duplicating = useKeyPress("Alt") && hovered

    // look at our errors from the last run
    const errors = lastRun?.errors?.[id] ?? []

    // helper function for rendering custom handles
    const renderCustomHandles = (handles, dataType, handleType, position) =>
        handles?.map(handle => {
            // handle can either be a string or { name, label }
            const { name, label } = typeof handle === "string" ? { name: handle } : handle

            return <CustomHandle
                name={name}
                label={label}
                // showLabel={hovered || selected}
                showLabel={hovered}
                {...{ dataType, handleType, position }}
                key={name}
            />
        })

    // custom component for rendering inner node content
    const ContentWithIcon = ({ children }) => (
        <Group spacing="xs">
            {nodeType.color ?
                <ThemeIcon color={nodeType.color} size="sm" radius="xl">
                    <nodeType.icon size={10} />
                </ThemeIcon>
                :
                <nodeType.icon size={16} />
            }
            <Box>
                {children}
            </Box>
        </Group>
    )

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: selected ? 1.1 : 1, }}
            onAnimationComplete={nodeUpdateInterval.stop}
            ref={hoverRef}
        >
            <HandleStack position={Position.Left} ref={leftStackRef}>
                {renderCustomHandles(nodeType.valueTargets, DataType.Value, "target", Position.Left)}
                {renderCustomHandles(nodeType.signalTargets, DataType.Signal, "target", Position.Left)}
            </HandleStack>

            <HandleStack position={Position.Right} ref={rightStackRef}>
                {renderCustomHandles(nodeType.valueSources, DataType.Value, "source", Position.Right)}
                {renderCustomHandles(nodeType.signalSources, DataType.Signal, "source", Position.Right)}
            </HandleStack>

            <Card
                radius="md"
                p="sm"
                px="md"
                shadow={selected ? "lg" : "sm"}
                mih={stackHeight}
                sx={cardStyle(id, { copyCursor: duplicating })}
                onDoubleClick={() => setData({ expanded: true, focused: true })}
            >
                <Flex>
                    {nodeType.renderNode ?
                        <nodeType.renderNode {...displayProps} containerComponent={ContentWithIcon} />
                        :
                        <ContentWithIcon>
                            <Text maw={120} lh={1.2} size="xs" ff="DM Sans">{nodeType.renderName?.(displayProps) ?? nodeType.name}</Text>
                        </ContentWithIcon>
                    }
                </Flex>
            </Card>

            <ErrorIcon show={!!errors.length} errors={errors} onClick={() => openSettings("errors")} />
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


function ErrorIcon({ show = false, errors, onClick }) {

    const theme = useMantineTheme()

    return (
        <Box
            sx={{
                position: "absolute",
                top: -8,
                right: -8,
                zIndex: 11,
            }}
        >
            <AnimatePresence>
                {show &&
                    <motion.div initial={{ scale: 0, rotate: -135 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -135 }} transition={{ duration: 0.1 }}>
                        <Tooltip label="View Error" size="xs">
                            <ActionIcon
                                size="xs"
                                radius="xl"
                                variant="filled"
                                color="red.7"
                                onClick={onClick}
                            >
                                <TbExclamationMark />
                            </ActionIcon>
                        </Tooltip>
                    </motion.div>
                }
            </AnimatePresence>
        </Box>
    )
}


const cardStyle = (id, { copyCursor }) => theme => ({
    overflow: "visible",
    display: "flex",
    backgroundColor: id == "trigger" && theme.colors.yellow[5],
    cursor: copyCursor ? "copy" : undefined,
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
