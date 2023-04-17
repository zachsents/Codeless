import { ActionIcon, Button, Card, Divider, Flex, Group, Popover, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useDeleteNode, useNodeProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import AnimatedTabs from "@web/components/AnimatedTabs"
import { useAppContext } from "@web/modules/context"
import { TbCopy, TbExternalLink, TbTrash } from "react-icons/tb"
import InputConfig from "./InputConfig"
import OutputConfig from "./OutputConfig"
import { getNodeIntegrationsStatus } from "@web/modules/graph-util"
import IntegrationAlert from "../config-panel/IntegrationAlert"


export default function ConfigPopover({ children }) {

    const theme = useMantineTheme()

    const typeDefinition = useTypeDefinition()
    const selected = useNodeProperty(null, "selected")
    const dragging = useNodeProperty(null, "dragging")

    const deleteNode = useDeleteNode()

    const { integrations: appIntegrations, app } = useAppContext()
    const nodeIntegrations = getNodeIntegrationsStatus(typeDefinition, appIntegrations)
    const hasMissingIntegrations = nodeIntegrations.some(int => !int.status.data)

    return (
        <Popover
            zIndex={210}
            withinPortal
            position="right"
            offset={20}
            opened={selected && !dragging}
            styles={{
                dropdown: {
                    border: "none",
                }
            }}
        >
            <Popover.Target>
                {children}
            </Popover.Target>

            <Popover.Dropdown p={0}>

                {/* Controls */}
                <Card shadow="sm" p="md" className="ofv">
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
                            <Stack spacing="xs">
                                {typeDefinition.inputs.length ?
                                    typeDefinition.inputs.map((input, i) =>
                                        <InputConfig id={input.id} divider={i != 0} key={input.id} />
                                    ) :
                                    <Text align="center" size="sm" color="dimmed">
                                        No Inputs
                                    </Text>}
                            </Stack>

                            <Stack spacing="xs">
                                {typeDefinition.outputs.length ?
                                    typeDefinition.outputs.map((output, i) =>
                                        <OutputConfig id={output.id} divider={i != 0} key={output.id} />
                                    ) :
                                    <Text align="center" size="sm" color="dimmed">
                                        No Outputs
                                    </Text>}
                            </Stack>

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
                </Card>
            </Popover.Dropdown>
        </Popover>
    )
}
