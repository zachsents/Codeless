import { ActionIcon, Card, Divider, Group, Popover, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useDeleteNode, useNodeProperty, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { TbCopy, TbTrash } from "react-icons/tb"
import InputConfig from "./InputConfig"

export default function ConfigPopover({ children }) {

    const theme = useMantineTheme()

    const typeDefinition = useTypeDefinition()
    const selected = useNodeProperty(null, "selected")
    const dragging = useNodeProperty(null, "dragging")

    const deleteNode = useDeleteNode()

    return (
        <Popover
            zIndex={195}
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
                        <Text size="sm" weight={600} color="gray" transform="uppercase" ff="Rubik">
                            Inputs
                        </Text>
                        <Stack spacing="xs" miw={280}>
                            {typeDefinition.inputs.map(input =>
                                <InputConfig id={input.id} key={input.id} />
                            )}
                        </Stack>
                    </Stack>
                </Card>
            </Popover.Dropdown>
        </Popover>
    )
}
