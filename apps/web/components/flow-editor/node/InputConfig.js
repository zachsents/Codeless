import { Box, Button, Center, Divider, Group, Stack, Text, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core"
import { InputMode, ListMode, useHandleDefinition, useInputMode, useNodeContext, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"
import { formatHandleName } from "@web/modules/graph-util"
import { TbInfoCircle } from "react-icons/tb"
import ListConfig from "./ListConfig"


export default function InputConfig({ id }) {

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
    // const isUnnamedList = definition.listMode == ListMode.Unnamed
    // const isNamedList = definition.listMode == ListMode.Named

    const { displayProps } = useNodeContext()

    return (
        <>
            <Divider color="gray.2" />
            <Stack spacing="xs">
                <Group position="apart">
                    <Group spacing="xs">

                        {isHandle ?
                            <ThemeIcon variant="outline" size="md" radius="xl" color={typeDefinition.color}>
                                {definition.icon &&
                                    <definition.icon size={theme.fontSizes.md} />}
                            </ThemeIcon> :
                            <ThemeIcon variant="light" size="md" radius="xl" color="gray" bg="transparent">
                                {definition.icon &&
                                    <definition.icon size={theme.fontSizes.md} />}
                            </ThemeIcon>}

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
                        {canChangeMode && isHandle &&
                            <Button size="xs" compact variant="light" onClick={() => setInputMode(InputMode.Config)}>
                                Configure Here
                            </Button>}

                        {canChangeMode && isConfig &&
                            <Button size="xs" compact variant="light" onClick={() => setInputMode(InputMode.Handle)}>
                                Add to Node
                            </Button>}
                    </Group>
                </Group>

                {isConfig && definition.renderConfiguration &&
                    <Box ml="xl">
                        <definition.renderConfiguration inputId={definition.id} {...displayProps} />
                    </Box>}

                {isList &&
                    <ListConfig handleId={id} />}
            </Stack>
        </>
    )
}

