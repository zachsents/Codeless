import { ActionIcon, Card, Divider, Group, Popover, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useDeleteNode, useNodeProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import AnimatedTabs from "@web/components/AnimatedTabs"
import { TbCopy, TbTrash } from "react-icons/tb"
import InputConfig from "./InputConfig"
import OutputConfig from "./OutputConfig"


export default function ConfigPopover({ children }) {

    const theme = useMantineTheme()

    const typeDefinition = useTypeDefinition()
    const selected = useNodeProperty(null, "selected")
    const dragging = useNodeProperty(null, "dragging")

    const deleteNode = useDeleteNode()

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

                        <AnimatedTabs tabs={["Inputs", "Outputs"]} w={280}>
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
                        </AnimatedTabs>

                    </Stack>
                </Card>
            </Popover.Dropdown>
        </Popover>
    )
}
