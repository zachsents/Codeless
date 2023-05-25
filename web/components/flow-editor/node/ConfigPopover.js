import { ActionIcon, Button, Divider, Group, Popover, ScrollArea, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useDeleteNode, useIntegrationAccounts, useNodeId, useNodeProperty, useStoreProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import AnimatedTabs from "@web/components/AnimatedTabs"
import { useAppContext, useReplayContext } from "@web/modules/context"
import { useCurrentlySelectedNode } from "@web/modules/graph-util"
import { TbExternalLink, TbMaximize, TbSettings, TbTrash } from "react-icons/tb"
import { useReactFlow } from "reactflow"
import IntegrationAlert from "../config-panel/IntegrationAlert"
import InputConfig from "./InputConfig"
import OutputConfig from "./OutputConfig"


export default function ConfigPopover({ children }) {

    const rf = useReactFlow()
    const theme = useMantineTheme()

    const nodeId = useNodeId()
    const typeDefinition = useTypeDefinition()
    const selectedNode = useCurrentlySelectedNode()
    const isSelected = selectedNode?.id == nodeId
    const isDragging = useNodeProperty(null, "dragging")

    const [_contextMenu, setContextMenu] = useStoreProperty("contextMenu")
    const isContextMenu = _contextMenu === nodeId

    const deleteNode = useDeleteNode()

    // #region - Integration stuff
    const { app } = useAppContext()

    const { requiredIntegrations, missingSelections, needsAccounts } = useIntegrationAccounts(null, app)

    // #endregion

    const { run } = useReplayContext()

    // #region - Tab stuff
    const tabData = ["Inputs", "Outputs"]
    needsAccounts && tabData.push("Integrations")

    const defaultTab = missingSelections ?
        "Integrations" :
        typeDefinition.inputs.length > 0 ? "Inputs" : "Outputs"
    // #endregion

    const fitView = () => {
        const node = rf.getNode(nodeId)
        rf.fitBounds({
            x: node.position.x,
            y: node.position.y,
            width: node.width,
            height: node.height,
        }, {
            duration: 400,
        })
    }

    return (
        <Popover
            opened={isSelected && !isDragging}
            // opened={isContextMenu && !isDragging}
            withinPortal
            position={!isContextMenu ? "top" : run ? "left" : "right"}
            shadow="md"
            offset={20}
            zIndex={210}
            classNames={{
                dropdown: "ofv",
            }}

            transitionProps={{
                onExited: () => isContextMenu && !isDragging && setContextMenu(null),
            }}
        >
            <Popover.Target>
                {children}
            </Popover.Target>

            {/* Controls */}
            <Popover.Dropdown
                p={isContextMenu ? "xs" : "xxxs"}
                /**
                 * ReactFlow throws an error if we delete the node by clicking inside
                 * the popover. The event used depends on the selectNodesOnDrag prop
                 * on the ReactFlow component.
                 */
                onClick={event => event.stopPropagation()}
            // onMouseDownCapture={event => event.stopPropagation()}

            >
                <Stack spacing="xxs">
                    <Group spacing={isContextMenu ? "md" : "xs"} noWrap position="center">
                        {/* Duplicate */}
                        {/* <Tooltip label="Duplicate">
                            <ActionIcon disabled size="lg">
                                <TbCopy size={theme.fontSizes.lg} />
                            </ActionIcon>
                        </Tooltip> */}

                        <Tooltip label={isContextMenu ? "Hide Settings" : "Show Settings"}>
                            <ActionIcon
                                variant={isContextMenu ? "filled" : "subtle"}
                                size="lg"
                                color=""
                                onClick={() => setContextMenu(isContextMenu ? null : nodeId)}
                            >
                                <TbSettings size={theme.fontSizes.lg} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Focus">
                            <ActionIcon
                                size="lg"
                                color="gray"
                                onClick={fitView}
                            >
                                <TbMaximize size={theme.fontSizes.lg} />
                            </ActionIcon>
                        </Tooltip>

                        {/* Delete */}
                        {typeDefinition.deletable &&
                            <Tooltip label="Delete">
                                <ActionIcon size="lg" color="red" onClick={deleteNode}>
                                    <TbTrash size={theme.fontSizes.lg} />
                                </ActionIcon>
                            </Tooltip>}
                    </Group>

                    {isContextMenu && <>
                        <Divider />
                        <AnimatedTabs tabs={tabData} defaultTab={defaultTab} size="xxs" w="24rem">

                            <ScrollArea.Autosize mah="70vh" offsetScrollbars>
                                <Stack spacing="xxs">
                                    {typeDefinition.inputs.length ?
                                        typeDefinition.inputs.map((input, i) =>
                                            <InputConfig id={input.id} divider={i != 0} key={input.id} />
                                        ) :
                                        <Text align="center" size="xs" color="dimmed">
                                            No Inputs
                                        </Text>}
                                </Stack>
                            </ScrollArea.Autosize>

                            <ScrollArea.Autosize mah="70vh" offsetScrollbars>
                                <Stack spacing="xxs">
                                    {typeDefinition.outputs.length ?
                                        typeDefinition.outputs.map((output, i) =>
                                            <OutputConfig id={output.id} divider={i != 0} key={output.id} />
                                        ) :
                                        <Text align="center" size="xs" color="dimmed">
                                            No Outputs
                                        </Text>}
                                </Stack>
                            </ScrollArea.Autosize>

                            {needsAccounts &&
                                <Stack spacing="xxs">
                                    <Group position="right">
                                        {/* <Text color={theme.other.halfDimmed} size="sm">Integration Accounts</Text> */}

                                        <Button
                                            component="a"
                                            href={`/app/${app?.id}?tab=integrations`}
                                            target="_blank"
                                            rightIcon={<TbExternalLink />}
                                            size="xs" compact variant="subtle" color="gray"
                                        >
                                            Manage Accounts
                                        </Button>
                                    </Group>

                                    <Stack spacing="xxxs" px="sm">
                                        {requiredIntegrations.map(integrationId =>
                                            <IntegrationAlert id={integrationId} key={integrationId} />
                                        )}
                                    </Stack>
                                </Stack>}
                        </AnimatedTabs>
                    </>}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}
