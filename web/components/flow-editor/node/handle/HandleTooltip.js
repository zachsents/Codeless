import { ActionIcon, Stack, Text } from "@mantine/core"
import { AnimatePresence, motion } from "framer-motion"
import { useReactFlow } from "reactflow"

import { HandleType, InputMode, useHandleDefinition, useHandleSuggestions, useIsNodeConnecting, useNodeId, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { openNodePalette as _openNodePalette, addNeighborNode } from "@web/modules/graph-util"
import { jc } from "@web/modules/util"
import { TbPlus } from "react-icons/tb"
import Suggestion from "./Suggestion"


export default function HandleTooltip({ id, handleHovered }) {

    const nodeTypeDefinition = useTypeDefinition()

    const { type } = useHandleDefinition(null, id)
    const currentlyConnecting = useIsNodeConnecting()

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
    const openNodePalette = () => {
        _openNodePalette(rf, {
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
                            !outputDef.listMode && outputDef.defaultShowing
                        )
                        if (potentialOutputs.length == 1)
                            suggestion.handle = potentialOutputs[0].id
                    }

                    // case for output handles -- we'll look for a single input handle
                    if (type == HandleType.Output) {
                        const potentialInputs = nodeTypeDef.inputs.filter(inputDef =>
                            !inputDef.listMode &&
                            inputDef.allowedModes.includes(InputMode.Handle) &&
                            inputDef.defaultMode == InputMode.Handle
                        )
                        if (potentialInputs.length == 1)
                            suggestion.handle = potentialInputs[0].id
                    }

                    // finally, we'll add the node
                    addSuggested(suggestion)
                },
            },
        })
    }

    // only show 3 suggestions
    const visibleSuggestions = suggestions.slice(0, 3)

    return (
        <AnimatePresence>
            {
                !currentlyConnecting && handleHovered &&
                <div
                    className={jc(
                        "absolute top-1/2 -translate-y-1/2 px-xs",
                        type == HandleType.Input ? "right-full" : "left-full",
                    )}

                    /**
                     * This is a hack to prevent clicks here from selecting the node.
                     * Class name "nodrag" (above) helps with dragging, but not clicking.
                     * See NodeBuilder and ConfigPopover for more info on this.
                     */
                    onClick={event => event.stopPropagation()}
                    onMouseDownCapture={event => event.stopPropagation()}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.2 }}
                    >
                        <ActionIcon
                            radius="xl" size="sm" variant="filled" color="primary"
                            className="shadow-xs z-10 hover:scale-125 active:scale-110 transition-transform"
                            onClick={openNodePalette}
                        >
                            <TbPlus size="0.75rem" />
                        </ActionIcon>
                    </motion.div>

                    {/* Provides an extra hitbox */}
                    <div className={jc(
                        "absolute top-full -mt-px",
                        type == HandleType.Input ? "right-0 pr-lg -mr-lg" : "left-0 pl-lg -ml-lg",
                    )}>
                        <Stack
                            spacing="xxxs" px="xs" py="xxxs"
                            align={type == HandleType.Input ? "end" : "start"}
                        >
                            {suggestions.length > 0 &&
                                <Text size="xxxs" color="dimmed" className="whitespace-nowrap -mb-1">
                                    Suggestions
                                </Text>}

                            {visibleSuggestions.map((suggestion, i) =>
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
                    </div>
                </div>}
        </AnimatePresence>
    )
}
