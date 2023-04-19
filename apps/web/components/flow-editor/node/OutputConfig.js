import { ActionIcon, Center, Divider, Group, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useHandleDefinition, useOutputShowing, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName } from "@web/modules/graph-util"
import { TbEye, TbInfoCircle } from "react-icons/tb"
import ListConfig from "./ListConfig"

export default function OutputConfig({ id, divider = true }) {

    const theme = useMantineTheme()

    const { definition } = useHandleDefinition(null, id)
    const typeDefinition = useTypeDefinition()

    // Showing
    const [showing, setShowing] = useOutputShowing(null, id)

    // List Mode
    const isList = !!definition.listMode

    return (
        <>
            {divider &&
                <Divider color="gray.2" />}
            <Stack spacing="xs">
                <Group position="apart" noWrap>
                    <Group spacing="xs" noWrap>

                        <Tooltip label="Toggle Visibility" withinPortal>
                            <ActionIcon
                                onClick={() => setShowing(!showing)}
                                size="md" radius="xl"
                                color={showing ? typeDefinition.color : "gray"}
                                variant={showing ? "filled" : "outline"}
                            >
                                {definition.icon ?
                                    <definition.icon size={theme.fontSizes.md} /> :
                                    <TbEye />}
                            </ActionIcon>
                        </Tooltip>

                        <Text>
                            {definition.name || formatHandleName(definition.id)}
                        </Text>

                        {definition.tooltip &&
                            <Tooltip
                                withinPortal
                                label={<Text sx={{ overflowWrap: "anywhere" }}>{definition.tooltip}</Text>}
                                // position="left"
                                multiline
                                maw={300}
                            >
                                <Center>
                                    <TbInfoCircle color={theme.colors.gray[6]} />
                                </Center>
                            </Tooltip>}
                    </Group>

                    <Group spacing="xs">
                        <Text color="dimmed" size="sm" mx="md">
                            {showing ? "Showing" : "Hidden"}
                        </Text>
                    </Group>
                </Group>

                {isList &&
                    <ListConfig handleId={id} />}
            </Stack>
        </>
    )
}
