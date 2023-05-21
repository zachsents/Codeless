import { Button, Center, Divider, Group, Stack, Text, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core"
import { InputMode, useHandleDefinition, useInputMode, useNodeContext, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName } from "@web/modules/graph-util"
import { TbInfoCircle } from "react-icons/tb"
import ListConfig from "./ListConfig"


export default function InputConfig({ id, divider = true }) {

    const theme = useMantineTheme()

    const { definition } = useHandleDefinition(null, id)
    const typeDefinition = useTypeDefinition()

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

            <Group spacing="sm" noWrap>
                <Stack spacing="xxxs" w={(isConfig || isList) ? "10rem" : "auto"}>
                    <Group spacing="xs" noWrap>

                        {isHandle ?
                            <ThemeIcon variant="outline" size="md" radius="xl" color={typeDefinition.color}>
                                {definition.icon &&
                                    <definition.icon size={theme.fontSizes.md} />}
                            </ThemeIcon> :
                            <ThemeIcon variant="light" size="md" radius="xl" color="gray" bg="transparent">
                                {definition.icon &&
                                    <definition.icon size={theme.fontSizes.md} />}
                            </ThemeIcon>}

                        <Text size="xs">
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

                    <Group spacing="xs">
                        {canChangeMode && isHandle &&
                            <Button size="xs" compact variant="light" color="gray" onClick={() => setInputMode(InputMode.Config)}>
                                Configure Here
                            </Button>}

                        {canChangeMode && isConfig &&
                            <Button size="xs" compact variant="light" color="gray" onClick={() => setInputMode(InputMode.Handle)}>
                                Add as Input
                            </Button>}
                    </Group>

                    <Text size="xs" color="dimmed">
                        {definition.description}
                    </Text>
                </Stack>

                {(isConfig || isList) &&
                    <Stack justify="center" className="flex-1 self-stretch">
                        {isConfig && definition.renderConfiguration && !isList &&
                            <definition.renderConfiguration inputId={definition.id} {...displayProps} />}

                        {isList &&
                            <ListConfig handleId={id} />}
                    </Stack>}
            </Group>
        </>
    )
}

