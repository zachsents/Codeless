import { forwardRef } from "react"
import { Card, Group, Flex, Stack, Tooltip, Text, Box, ActionIcon, useMantineTheme, ThemeIcon, Badge } from "@mantine/core"
import { useHover, useInterval, useSetState } from "@mantine/hooks"
import { Position, useKeyPress, useUpdateNodeInternals } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import { DataType } from "../../modules/dataTypes"
import CustomHandle from "./CustomHandle"
import { useNodeData, useNodeDisplayProps } from "../../util"
import { TbExclamationMark } from "react-icons/tb"
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

    // state for handle alignment
    // const [handleAlignments, setHandleAlignments] = useSetState()
    const handleAlignments = useRef({})
    const headerRef = useRef()
    const handleAlignHandles = (handleNames, el) => {
        const alignHandle = handleName => {
            handleAlignments.current[handleName] = el === null ? headerRef.current : el
        }

        if (typeof handleNames === "string") {
            alignHandle(handleNames)
            return
        }

        handleNames.forEach(alignHandle)
    }

    // helper function for rendering custom handles
    const renderCustomHandles = (handles, handleType, position) =>
        handles?.map(handle => {
            // handle can either be a string or { name, label }
            const { name, label, list } = typeof handle === "string" ? { name: handle } : handle

            // if it's a list handle, get current number of handles
            const numberOfHandles = list ? (data?.listHandles?.[name] ?? 0) : 1

            return Array(numberOfHandles).fill(0).map((_, i) =>
                <CustomHandle
                    name={name}
                    index={list && i}
                    label={label}
                    showLabel={hovered}
                    align={handleAlignments.current[list ? `${name}.${i}` : name]}
                    {...{ handleType, position }}
                    key={`${name}.${i}`}
                />
            )
        }).flat()

    // custom component for rendering inner node content
    const ContentWithIcon = forwardRef(({ children }, ref) => (
        <Group spacing="xs" ref={ref}>
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
    ))

    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: selected ? 1.1 : 1, }}
            onAnimationComplete={nodeUpdateInterval.stop}
            ref={hoverRef}
        >
            <HandleStack position={Position.Left} ref={leftStackRef}>
                {renderCustomHandles(nodeType.inputs, "target", Position.Left)}
            </HandleStack>

            <HandleStack position={Position.Right} ref={rightStackRef}>
                {renderCustomHandles(nodeType.outputs, "source", Position.Right)}
            </HandleStack>

            <Card
                radius="md"
                p="sm"
                shadow={selected ? "lg" : "sm"}
                mih={stackHeight}
                sx={cardStyle(id, { copyCursor: duplicating })}
                onDoubleClick={() => setData({ expanded: true, focused: true })}
            >
                <Card.Section withBorder p="xs">
                    <Group position="apart" ref={headerRef}>
                        <Group spacing="xs">
                            {nodeType.color ?
                                <ThemeIcon color={nodeType.color} size="sm" radius="xl">
                                    <nodeType.icon size={10} />
                                </ThemeIcon>
                                :
                                <nodeType.icon size={16} />
                            }
                            <Text
                                maw={120}
                                lh={1.2}
                                size="xs"
                                ff="DM Sans"
                            >
                                {nodeType.renderName?.(displayProps) ?? nodeType.name}
                            </Text>
                        </Group>

                        {nodeType.badge &&
                            <Badge size="xs" color={nodeType.color ?? "gray"}>
                                {nodeType.badge}
                            </Badge>}
                    </Group>
                </Card.Section>


                {nodeType.renderNode &&
                    <Box mt="sm">
                        <nodeType.renderNode
                            {...displayProps}
                            containerComponent={ContentWithIcon}
                            alignHandles={handleAlignHandles}
                        />
                    </Box>
                }

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
    // display: "flex",
    backgroundColor: id == "trigger" && theme.colors.yellow[5],
    cursor: copyCursor ? "copy" : undefined,
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
