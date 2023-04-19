import { ActionIcon, Button, Divider, Flex, Group, Popover, ScrollArea, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useDeleteNode, useNodeId, useNodeProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import AnimatedTabs from "@web/components/AnimatedTabs"
import { useAppContext, useReplayContext } from "@web/modules/context"
import { getNodeIntegrationsStatus, useCurrentlySelectedNode } from "@web/modules/graph-util"
import { TbCopy, TbExternalLink, TbTrash } from "react-icons/tb"
import IntegrationAlert from "../config-panel/IntegrationAlert"
import InputConfig from "./InputConfig"
import OutputConfig from "./OutputConfig"


export default function ConfigPopover({ children }) {

    const theme = useMantineTheme()

    const typeDefinition = useTypeDefinition()
    const nodeId = useNodeId()
    const selectedNode = useCurrentlySelectedNode()
    const isSelected = selectedNode?.id == nodeId
    const isDragging = useNodeProperty(null, "dragging")

    const deleteNode = useDeleteNode()

    const { integrations: appIntegrations, app } = useAppContext()
    const nodeIntegrations = getNodeIntegrationsStatus(typeDefinition, appIntegrations)
    const hasMissingIntegrations = nodeIntegrations.some(int => !int.status.data)

    const { run } = useReplayContext()

    return (
        <Popover
            opened={isSelected && !isDragging}
            withinPortal
            position={!!run ? "left" : "right"}
            shadow="sm"
            offset={20}
            zIndex={210}
            classNames={{
                dropdown: "ofv",
            }}
        >
            <Popover.Target>
                {children}
            </Popover.Target>

            {/* Controls */}
            <Popover.Dropdown p="md">
                <Stack spacing="xs">
                    <Group spacing="xs" noWrap position="center">
                        {/* Duplicate */}
                        <Tooltip label="Duplicate">
                            <ActionIcon disabled size="lg">
                                <TbCopy size={theme.fontSizes.lg} />
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
                    <Divider />

                    <AnimatedTabs
                        tabs={["Inputs", "Outputs", "Integrations"]}
                        defaultTab={hasMissingIntegrations ? "Integrations" :
                            typeDefinition.inputs.length ? "Inputs" : "Outputs"}
                        miw={280}
                    >
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
                        </Stack>
                    </AnimatedTabs>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}
