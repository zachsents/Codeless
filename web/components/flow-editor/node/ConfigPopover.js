import { ActionIcon, Button, Divider, Flex, Group, Popover, ScrollArea, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useDeleteNode, useNodeId, useNodeProperty, useStoreProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import AnimatedTabs from "@web/components/AnimatedTabs"
import { useAppContext, useReplayContext } from "@web/modules/context"
import { getNodeIntegrationsStatus, useCurrentlySelectedNode } from "@web/modules/graph-util"
import { TbExternalLink, TbSettings, TbTrash } from "react-icons/tb"
import IntegrationAlert from "../config-panel/IntegrationAlert"
import InputConfig from "./InputConfig"
import OutputConfig from "./OutputConfig"


export default function ConfigPopover({ children }) {

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
    const { integrations: appIntegrations, app } = useAppContext()
    const nodeIntegrations = getNodeIntegrationsStatus(typeDefinition, appIntegrations)
    const hasIntegrations = nodeIntegrations.length > 0
    const hasMissingIntegrations = nodeIntegrations.some(int => !int.status.data)
    // #endregion

    const { run } = useReplayContext()

    // #region - Tab stuff
    const tabData = ["Inputs", "Outputs"]
    hasIntegrations && tabData.push("Integrations")

    const defaultTab = hasMissingIntegrations ? "Integrations" :
        typeDefinition.inputs.length > 0 ? "Inputs" : "Outputs"
    // #endregion

    return (
        <Popover
            opened={isSelected && !isDragging}
            // opened={isContextMenu && !isDragging}
            withinPortal
            position={!isContextMenu ? "top" : run ? "left" : "right"}
            shadow="sm"
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
                p={isContextMenu ? "sm" : 4}
                /**
                 * ReactFlow throws an error if we delete the node by clicking inside
                 * the popover. The event used depends on the selectNodesOnDrag prop
                 * on the ReactFlow component.
                 */
                onClick={event => event.stopPropagation()}
                onMouseDownCapture={event => event.stopPropagation()}

            >
                <Stack spacing="xs">
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
                        <AnimatedTabs tabs={tabData} defaultTab={defaultTab} miw={280}>

                            <ScrollArea.Autosize mah="70vh" offsetScrollbars>
                                <Stack spacing="xs">
                                    {typeDefinition.inputs.length ?
                                        typeDefinition.inputs.map((input, i) =>
                                            <InputConfig id={input.id} divider={i != 0} key={input.id} />
                                        ) :
                                        <Text align="center" size="sm" color="dimmed">
                                            No Inputs
                                        </Text>}
                                </Stack>
                            </ScrollArea.Autosize>

                            <ScrollArea.Autosize mah="70vh" offsetScrollbars>
                                <Stack spacing="xs">
                                    {typeDefinition.outputs.length ?
                                        typeDefinition.outputs.map((output, i) =>
                                            <OutputConfig id={output.id} divider={i != 0} key={output.id} />
                                        ) :
                                        <Text align="center" size="sm" color="dimmed">
                                            No Outputs
                                        </Text>}
                                </Stack>
                            </ScrollArea.Autosize>

                            {hasIntegrations &&
                                <Stack spacing="xs">
                                    {nodeIntegrations.map(
                                        int => <IntegrationAlert integration={int} key={int.id} />
                                    )}

                                    {nodeIntegrations.length > 0 &&
                                        <Flex justify="flex-end">
                                            <Button
                                                component="a"
                                                href={`/app/${app?.id}/integrations`}
                                                target="_blank"
                                                rightIcon={<TbExternalLink />}
                                                size="xs"
                                                compact
                                                variant="light"
                                                color="gray"
                                            >
                                                Open Integrations
                                            </Button>
                                        </Flex>}
                                </Stack>}
                        </AnimatedTabs>
                    </>}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}
