import { Box, Button, Group, Stack, Text } from "@mantine/core"
import { AnimatePresence, motion } from "framer-motion"
import { useReactFlow } from "reactflow"

import { HandleType, InputMode, useHandleDefinition, useHandleSuggestions, useIsNodeConnecting, useNodeId, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { openNodePalette as _openNodePalette, addNeighborNode, formatHandleName } from "@web/modules/graph-util"
import { TbPlus } from "react-icons/tb"
import styles from "./Handle.module.css"
import Suggestion from "./Suggestion"


export default function HandleTooltip({ id, label, show, showSuggestions }) {

    const nodeTypeDefinition = useTypeDefinition()

    const { type, definition } = useHandleDefinition(null, id)
    const currentlyConnecting = useIsNodeConnecting()

    label ??= definition.name || formatHandleName(id)

    const rf = useReactFlow()
    const nodeId = useNodeId()

    // suggestions
    const suggestions = useHandleSuggestions(null, id)

    // adding suggested nodes
    const addSuggested = (suggestion) => {
        addNeighborNode(rf, {
            originNodeId: nodeId,
            originHandle: id,
            type: suggestion?.node,
            handle: suggestion?.handle,
            direction: type,
        })
    }

    // opening node palette
    const openNodePalette = () => _openNodePalette(rf, {
        subtitle: `${type == HandleType.Input ? "preceeding" : "following"} "${nodeTypeDefinition.name}"`,
        innerProps: {
            suggestions: suggestions?.length > 0 && [...new Set(
                suggestions.map(sugg => sugg.node)
            )],
            onAdd: (nodeTypeDef) => {
                // first, see if the node picked was a suggestion
                let suggestion = suggestions?.find(sugg => sugg.node == nodeTypeDef.id)
                if (suggestion)
                    return addSuggested(suggestion)

                // if not, we'll try to decide which handle to connect to
                suggestion = {
                    node: nodeTypeDef.id,
                    handle: null,
                }

                // case for input handles -- we'll look for a single output handle
                if (type == HandleType.Input) {
                    const potentialOutputs = nodeTypeDef.outputs.filter(outputDef =>
                        !outputDef.listMode
                    )
                    if (potentialOutputs.length == 1)
                        suggestion.handle = potentialOutputs[0].id
                }

                // case for output handles -- we'll look for a single input handle
                if (type == HandleType.Output) {
                    const potentialInputs = nodeTypeDef.inputs.filter(inputDef =>
                        !inputDef.listMode &&
                        inputDef.allowedModes.includes(InputMode.Handle)
                    )
                    if (potentialInputs.length == 1)
                        suggestion.handle = potentialInputs[0].id
                }

                // finally, we'll add the node
                addSuggested(suggestion)
            },
        },
    })

    // only show 3 suggestions
    const visibleSuggestions = suggestions.slice(0, 3)

    return (
        <AnimatePresence>
            {
                !currentlyConnecting &&
                show &&
                <Box className={`${styles.tooltipWrapper} ${styles[type]}`}>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stack spacing={5} align={type == HandleType.Input ? "end" : "start"} p="md" >

                            <Group
                                spacing="xs"
                                noWrap
                                sx={{ flexDirection: type == HandleType.Input ? "row-reverse" : "row" }}
                            >
                                {label &&
                                    <Text className={styles.tooltip}>{label}</Text>}

                                <Button
                                    compact
                                    size="xs"
                                    variant="light"
                                    onClick={openNodePalette}
                                >
                                    <TbPlus />
                                </Button>
                            </Group>

                            {suggestions.length > 0 &&
                                <Text size={8} color="dimmed" mb={-2} sx={{ whiteSpace: "nowrap" }}>
                                    {showSuggestions ?
                                        "Suggested Nodes:" :
                                        `${suggestions.length} Suggested Node${suggestions.length == 1 ? "" : "s"}`}
                                </Text>}

                            {showSuggestions && visibleSuggestions.map((suggestion, i) =>
                                <Suggestion
                                    nodeTypeDefId={suggestion.node}
                                    handleId={suggestion.handle}
                                    onClick={() => addSuggested(suggestion)}
                                    index={i + 1}
                                    // only include handle if this node shows up twice in the visible nodes
                                    showHandle={visibleSuggestions.filter(sugg => sugg.node == suggestion.node).length > 1}
                                    key={i}
                                />
                            )}
                        </Stack>
                    </motion.div>
                </Box>}
        </AnimatePresence>
    )
}
