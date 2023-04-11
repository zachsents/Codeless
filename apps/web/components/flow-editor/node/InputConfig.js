import { Box, Button, Center, Divider, Group, Stack, Text, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core"
import { formatHandleName, getNodeTypeById, useNodeData } from "@web/modules/graph-util"
import { useEffect } from "react"
import { TbInfoCircle } from "react-icons/tb"
import { useReactFlow } from "reactflow"

export const InputMode = {
    Handle: "handle",
    Config: "config",
}

export default function InputConfig({ input, nodeId, displayProps }) {

    const theme = useMantineTheme()

    const rf = useReactFlow()
    const typeDefinition = getNodeTypeById(rf, nodeId)
    const [data, setData] = useNodeData(nodeId)

    const inputModeKey = `InputMode.${input.id}`
    const inputMode = data[inputModeKey]
    const canChangeMode = input.allowedModes.length >= 2
    const isHandle = inputMode == InputMode.Handle
    const isConfig = inputMode == InputMode.Config

    // set default mode
    useEffect(() => {
        inputMode === undefined && setData({ [inputModeKey]: input.defaultMode })
    }, [inputMode])

    return (
        <>
            <Divider color="gray.2" />
            <Stack spacing="xs">
                <Group position="apart">
                    <Group spacing="xs">

                        {isHandle ?
                            <ThemeIcon variant="outline" size="md" radius="xl" color={typeDefinition.color}>
                                {input.icon &&
                                    <input.icon size={theme.fontSizes.md} />}
                            </ThemeIcon> :
                            <ThemeIcon variant="light" size="md" radius="xl" color="gray" bg="transparent">
                                {input.icon &&
                                    <input.icon size={theme.fontSizes.md} />}
                            </ThemeIcon>}

                        <Text>
                            {input.name || formatHandleName(input.id)}
                        </Text>

                        {input.tooltip &&
                            <Tooltip
                                withinPortal
                                label={<Text sx={{ overflowWrap: "anywhere" }}>{input.tooltip}</Text>}
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
                            <Button size="xs" compact variant="light" onClick={() => setData({ [inputModeKey]: InputMode.Config })}>
                                Configure Here
                            </Button>}

                        {canChangeMode && isConfig &&
                            <Button size="xs" compact variant="light" onClick={() => setData({ [inputModeKey]: InputMode.Handle })}>
                                Add to Node
                            </Button>}
                    </Group>
                </Group>

                {isConfig && input.renderConfiguration &&
                    <Box ml="xl">
                        <input.renderConfiguration
                            value={data[`InputValue.${input.id}`]}
                            setValue={value => setData({ [`InputValue.${input.id}`]: value })}
                            {...displayProps}
                        />
                    </Box>}
            </Stack>
        </>
    )
}

