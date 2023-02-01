import { forwardRef, useEffect } from "react"
import { Card, Group, Stack, Tooltip, Text, Box, ActionIcon, useMantineTheme, ThemeIcon, Badge } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { Position, useKeyPress } from "reactflow"
import { useNodeBuilder } from "../NodeBuilder"
import CustomHandle from "./CustomHandle"
import { useDeleteNode, useHandleAlignment, useNodeData, useNodeDisplayProps, useNodeMinHeight, useNodeSnapping } from "../../util"
import { TbCopy, TbExclamationMark, TbTrash } from "react-icons/tb"
import { AnimatePresence, motion } from "framer-motion"


export default function Node({ id, type, selected, xPos, yPos, ...props }) {

    const theme = useMantineTheme()
    const { nodeTypes, lastRun, openSettings } = useNodeBuilder()

    // get node type
    const nodeType = nodeTypes[type]

    const [data, setData] = useNodeData(id)                                     // node's internal data
    const displayProps = useNodeDisplayProps(id)                                // props to pass to display override components
    const [stackHeight, addHeightRef] = useNodeMinHeight()                      // making sure card is correct size
    const [handleAlignments, alignHandles, headerRef] = useHandleAlignment()    // handle alignment
    const handleDelete = useDeleteNode(id)

    // hover for showing handle labels
    const { hovered, ref: hoverRef } = useHover()

    // look at our errors from the last run
    const errors = lastRun?.errors?.[id] ?? []

    // alt-dragging for duplication -- TO DO: implement this
    const duplicating = useKeyPress("Alt") && hovered

    // side effect: when deselected, close node
    useEffect(() => {
        !selected && setData({ expanded: false, focused: false })
    }, [selected])

    // helper function for rendering custom handles
    const renderCustomHandles = (handles, handleType, position) =>
        handles?.map(handle => {
            // handle can either be a string or { name, label }
            const { name, label, list } = typeof handle === "string" ? { name: handle } : handle

            // if it's a list handle, get current number of handles
            const numberOfHandles = list ? (data?.listHandles?.[name] ?? 0) : 1

            return Array(numberOfHandles).fill(0).map((_, i) => {
                const handleId = list ? `${name}.${i}` : name
                return <CustomHandle
                    id={handleId}
                    name={name}
                    label={label}
                    showLabel={hovered}
                    connected={displayProps.connections[handleId]}
                    align={handleAlignments[handleId]}
                    position={position}
                    handleType={handleType}
                    key={handleId}
                />
            })
        }).flat()

    // handle snapping position 
    useNodeSnapping(id, xPos, yPos)

    return (
        <motion.div
            initial={{ outline: "none" }}
            animate={{ outline: `${selected ? 3 : 0}px solid ${theme.colors.yellow[5]}` }}
            transition={{ duration: 0.15 }}
            style={{ borderRadius: theme.radius.md }}
            ref={hoverRef}
        >

            {/* Handles */}
            <HandleStack position={Position.Left} ref={addHeightRef(0)}>
                {renderCustomHandles(nodeType.inputs, "target", Position.Left)}
            </HandleStack>

            <HandleStack position={Position.Right} ref={addHeightRef(1)}>
                {renderCustomHandles(nodeType.outputs, "source", Position.Right)}
            </HandleStack>

            {/* Main Content */}
            <Card
                radius="md"
                p="sm"
                shadow="sm"
                mih={stackHeight}
                sx={cardStyle(id, { copyCursor: duplicating, selected })}
            // onDoubleClick={() => setData({ expanded: true, focused: true })}
            >
                {/* Header */}
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

                {/* Body */}
                {nodeType.renderNode &&
                    <Box mt="sm">
                        <nodeType.renderNode
                            {...displayProps}
                            alignHandles={alignHandles}
                        />
                    </Box>
                }
            </Card>

            <ErrorIcon show={!!errors.length} errors={errors} onClick={() => openSettings("errors")} />

            {/* Controls */}
            <Box sx={controlsStyle}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: selected ? 1 : 0 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
                >
                    <Card shadow="sm" p={5} radius="md" sx={{pointerEvents: "all"}}>
                        <Group spacing="xs">
                            <ActionIcon size="md" radius="sm">
                                <TbCopy size={16} />
                            </ActionIcon>
                            {nodeType.deletable !== false &&
                                <ActionIcon size="md" radius="sm" color="red" onClick={handleDelete}>
                                    <TbTrash size={16} />
                                </ActionIcon>}
                        </Group>
                    </Card>
                </motion.div>
            </Box>
        </motion.div>
    )
}


const HandleStack = forwardRef(({ children, position, ...props }, ref) => {
    return (
        <Stack
            justify="center"
            sx={stackStyle(position)}
            {...props}
        >
            <Stack
                justify="space-evenly"
                align="center"
                spacing={0}
                ref={ref}
            >
                {children}
            </Stack>
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


const cardStyle = (id, { copyCursor, selected }) => theme => ({
    overflow: "visible",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // outline: selected ? `3px solid ${theme.colors.yellow[5]}` : "none",
    // border: id == "trigger" ? `4px solid ${theme.colors.dark[2]}` : "none",
    cursor: copyCursor ? "copy" : undefined,
})

const controlsStyle = theme => ({
    position: "absolute",
    bottom: "100%",
    left: "50%",
    marginBottom: theme.spacing.xs,
    transform: "translateX(-50%)",
    pointerEvents: "none",
})

const stackStyle = position => ({
    position: "absolute",
    top: "50%",
    zIndex: 10,
    minHeight: "100%",

    ...(position == Position.Left && {
        left: 0,
        transform: "translate(-50%, -50%)",
    }),
    ...(position == Position.Right && {
        right: 0,
        transform: "translate(50%, -50%)",
    }),
})
