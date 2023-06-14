import { ActionIcon, Button, Center, Divider, Group, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { useColors, useHandleDefinition, useOutputShowing, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName } from "@web/modules/graph-util"
import { TbEye, TbInfoCircle } from "react-icons/tb"
import ListConfig from "./ListConfig"

export default function OutputConfig({ id, divider = true }) {

    const theme = useMantineTheme()

    const { definition } = useHandleDefinition(null, id)
    const typeDefinition = useTypeDefinition()
    const [lightColor] = useColors(null, [0])

    // Showing
    const [showing, setShowing] = useOutputShowing(null, id)

    // List Mode
    const isList = !!definition.listMode

    return (
        <>
            {divider &&
                <Divider color="gray.2" />}

            <Stack spacing="xs">
                <Group spacing="xs" noWrap>

                    <Tooltip label="Toggle Visibility" withinPortal>
                        <ActionIcon
                            onClick={() => setShowing(!showing)}
                            size="md" radius="xl"
                            color={typeDefinition.color}
                            variant={showing ? "outline" : "subtle"}
                            bg={showing ? lightColor : undefined}
                        >
                            {definition.icon ?
                                <definition.icon size={theme.fontSizes.md} /> :
                                <TbEye />}
                        </ActionIcon>
                    </Tooltip>

                    <Stack spacing={0} className="flex-1">
                        <Group spacing="xs" noWrap>
                            <Text>
                                {definition.name || formatHandleName(definition.id)}
                            </Text>

                            {definition.tooltip && definition.tooltip != definition.description &&
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

                        {definition.description &&
                            <Text size="xs" color="dimmed">
                                {definition.description}
                            </Text>}
                    </Stack>

                    <Tooltip label={showing ? "Hide?" : "Show?"} withinPortal>
                        <Button
                            size="xs" compact variant="subtle" color="gray" w="5rem"
                            onClick={() => setShowing(!showing)}
                        >
                            {showing ? "Showing" : "Hidden"}
                        </Button>
                    </Tooltip>
                </Group>

                {isList &&
                    <ListConfig handleId={id} />}
            </Stack>
        </>
    )
}
