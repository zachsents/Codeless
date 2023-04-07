import { useEffect, useMemo, useRef } from "react"
import { Handle as RFHandle, useReactFlow, useStore } from "reactflow"
import { Box, useMantineTheme, Text, Stack, Group, Button } from "@mantine/core"
import { useHover } from "@mantine/hooks"
import { AnimatePresence, motion } from "framer-motion"
import { TbPlus } from "react-icons/tb"

import { addNeighborNode, getNodeTypeById, openNodePalette } from "@web/modules/graph-util"
import { HandleDirection } from "."
import Suggestion from "./Suggestion"

import styles from "./Handle.module.css"
import { useSmoothlyUpdateNode } from "@web/modules/graph-util"


export default function Handle({ id, label, direction, position, suggestions,
    connected, align, nodeHovered = false, onHover, nodeId, nodeName }) {

    const rf = useReactFlow()
    const theme = useMantineTheme()

    const nodeTypeDefinition = useMemo(() => getNodeTypeById(rf, nodeId), [rf, nodeId])
    const mainColor = theme.colors[nodeTypeDefinition.color][theme.primaryShade.light]
    const lightColor = theme.colors[nodeTypeDefinition.color][0]

    // keep track of connection node ID so we can hide tooltips while connecting
    // to get them out of the way
    const connectionNodeId = useStore(s => s.connectionNodeId)

    // unconnected inputs are styled special
    const isUnconnectedInput = !connected && direction == HandleDirection.Input

    // calculate alignment
    const wrapperRef = useRef()
    const alignHeight = align && (
        align.offsetTop + align.offsetHeight / 2 - wrapperRef.current?.offsetHeight / 2
    )

    // entire container hover -- pass state up as well
    const { hovered, ref: hoverRef } = useHover()
    useEffect(() => {
        onHover?.(hovered)
    }, [hovered])

    // adding suggested nodes
    const handleAddSuggested = (suggestion) => addNeighborNode(rf, {
        originNodeId: nodeId,
        originHandle: id,
        type: suggestion?.node,
        handle: suggestion?.handle,
        direction,
        topOffset: hoverRef.current?.offsetTop,
    })

    // opening node palette
    const handleOpenNodePalette = () => openNodePalette(rf, {
        subtitle: `${direction == HandleDirection.Input ? "preceeding" : "following"} "${nodeName}"`,
        innerProps: {
            suggestions: suggestions?.length > 0 && [...new Set(
                suggestions.map(sugg => sugg.node)
            )],
            onAdd: (type) => handleAddSuggested(
                suggestions?.find(sugg => sugg.node == type.id) ?? {
                    node: type.id,
                    // we'll try to connect if there's only one (non-list) handle
                    handle: direction == HandleDirection.Input ?
                        // case for input handles -- we'll look for a single output handle
                        (type.outputs.length == 1 && !type.outputs[0].list ?
                            (type.outputs[0].name ?? type.outputs[0]) :
                            null) :
                        // case for output handles -- we'll look for a single input handle
                        (type.inputs.length == 1 && !type.inputs[0].list ?
                            (type.inputs[0].name ?? type.inputs[0]) :
                            null)
                }
            ),
        },
    })

    // only show 3 suggestions
    const visibleSuggestions = suggestions?.slice(0, 3)

    // side-effect: fix node internals when connected state changes
    const stopUpdate = useSmoothlyUpdateNode(nodeId, [connected, hovered])
    useEffect(() => {
        setTimeout(() => stopUpdate(), 100)
    }, [connected, hovered])

    return (
        <Box pos={alignHeight ? "absolute" : "relative"} top={alignHeight || undefined} ref={hoverRef}>

            <div className={`${styles.wrapper} ${connected ? styles.connected : ""}`} ref={wrapperRef}>
                <RFHandle
                    id={id}
                    type={direction}
                    position={position}
                    className={styles.handle}
                    style={{
                        backgroundColor: lightColor,
                        border: `1px solid ${mainColor}`,
                    }}
                />
            </div>

            <AnimatePresence>
                {
                    connectionNodeId != nodeId &&
                    (nodeHovered || hovered) &&
                    <Box sx={tooltipWrapperStyle(position)}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                            transition={{ duration: 0.2 }}
                        >
                            <Stack spacing={5} align={position == "left" ? "end" : "start"} p={tooltipPadding} >

                                <Group spacing="xs" noWrap
                                    sx={{ flexDirection: direction == HandleDirection.Input ? "row-reverse" : "row" }}
                                >
                                    {label &&
                                        <Text sx={tooltipStyle(false)}>{label}{isUnconnectedInput ? " (not connected)" : ""}</Text>}

                                    <Button
                                        compact
                                        size="xs"
                                        variant="light"
                                        onClick={handleOpenNodePalette}
                                    >
                                        <TbPlus />
                                    </Button>
                                </Group>

                                {/* <Suggestion
                                    onClick={handleOpenNodePalette}
                                    icon={<TbSearch />}
                                    color={null}
                                    index={0}
                                >
                                    Search Nodes
                                </Suggestion> */}

                                {suggestions &&
                                    <Text size={8} color="dimmed" mb={-2} sx={{ whiteSpace: "nowrap" }}>
                                        {hovered ?
                                            "Suggested Nodes:" :
                                            `${suggestions.length} Suggested Node${suggestions.length == 1 ? "" : "s"}`}
                                    </Text>}

                                {hovered && visibleSuggestions?.map((suggestion, i) =>
                                    <Suggestion
                                        typeId={suggestion.node}
                                        // only include handle if this node shows up twice in the visible nodes
                                        handle={visibleSuggestions.filter(sugg => sugg.node == suggestion.node).length > 1 ?
                                            suggestion.handle : null}
                                        onClick={() => handleAddSuggested(suggestion)}
                                        index={i + 1}
                                        key={i}
                                    />
                                )}
                            </Stack>
                        </motion.div>
                    </Box>}
            </AnimatePresence>
        </Box>
    )
}




/* Tooltip */

const tooltipPadding = "md"

const tooltipWrapperStyle = position => theme => {
    const xTransform = `calc(${position == "left" ? "-100%" : "100%"
        } ${position == "left" ? "+" : "-"} ${theme.spacing[tooltipPadding]}px)`

    return {
        position: "absolute",
        top: "50%",
        [position]: 0,
        transform: `translate(${xTransform}, -${theme.spacing[tooltipPadding] + 10}px)`,
    }
}

const tooltipStyle = (button = false) => theme => ({
    fontSize: 10,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.dark[4],
    color: theme.colors.gray[0],
    padding: "2px 8px",
    whiteSpace: "nowrap",

    "&:hover": button ? {
        backgroundColor: theme.colors.dark[5],
    } : {},
})

