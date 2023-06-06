import { ActionIcon, Center, Divider, Group, Menu, Stack, Text, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core"
import { InputMode, useColors, useHandleDefinition, useInputMode, useNodeContext, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName } from "@web/modules/graph-util"
import { TbChartDots3, TbCursorText, TbDots, TbInfoCircle } from "react-icons/tb"
import ListConfig from "./ListConfig"


export default function InputConfig({ id, divider = true }) {

    const theme = useMantineTheme()

    const { definition } = useHandleDefinition(null, id)
    const typeDefinition = useTypeDefinition()
    const [lightColor] = useColors(null, [0])

    // Input Mode
    const [inputMode, setInputMode] = useInputMode(null, id)
    const canChangeMode = definition.allowedModes.length >= 2
    const isHandle = inputMode == InputMode.Handle
    const isConfig = inputMode == InputMode.Config

    // List Mode
    const isList = !!definition.listMode

    const { displayProps } = useNodeContext()

    return (
        <>
            {divider &&
                <Divider color="gray.2" />}

            <Stack spacing="xs">
                <Group spacing="xs" noWrap pr="xxs">
                    <ThemeIcon
                        size="md" radius="xl"
                        color={isHandle ? typeDefinition.color : "gray"}
                        variant={isHandle ? "outline" : "light"}
                        bg={isHandle ? lightColor : "transparent"}
                    >
                        {definition.icon &&
                            <definition.icon size={theme.fontSizes.md} />}
                    </ThemeIcon>

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
                                    maw="17rem"
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

                    {canChangeMode &&
                        <Menu shadow="sm" withinPortal>
                            <Menu.Target>
                                <ActionIcon size="sm" radius="sm" variant="light">
                                    <TbDots />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown maw="16rem">
                                {canChangeMode &&
                                    (isHandle ?
                                        <Menu.Item
                                            icon={<TbCursorText />}
                                            onClick={() => setInputMode(InputMode.Config)}
                                        >
                                            <Text>Configure Here</Text>
                                            <Text size="xs" color="dimmed">
                                                Enter a fixed value for this input.
                                            </Text>
                                        </Menu.Item> :
                                        <Menu.Item
                                            icon={<TbChartDots3 />}
                                            onClick={() => setInputMode(InputMode.Handle)}
                                        >
                                            <Text>Show on Node</Text>
                                            <Text size="xs" color="dimmed">
                                                Show this input on the node, and allow it to be connected to other nodes.
                                            </Text>
                                        </Menu.Item>)}
                            </Menu.Dropdown>
                        </Menu>}
                </Group>

                {(isConfig || isList) &&
                    <Stack justify="center" className="flex-1 self-stretch">
                        {isConfig && definition.renderConfiguration && !isList &&
                            <definition.renderConfiguration inputId={definition.id} {...displayProps} />}

                        {isList &&
                            <ListConfig handleId={id} />}
                    </Stack>}
            </Stack>
        </>
    )
}

