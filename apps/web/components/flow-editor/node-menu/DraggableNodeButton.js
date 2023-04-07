import { ActionIcon, Box, Center, Group, Text, Tooltip } from "@mantine/core"
import { NodeDefinitions } from "@minus/client-nodes"
import { useMantineTheme } from "@mantine/core"
import { TbPinned } from "react-icons/tb"


export default function DraggableNodeButton({ id, pinned = false }) {

    const theme = useMantineTheme()

    const node = NodeDefinitions[id]

    const mainColor = theme.colors[node.color][theme.primaryShade.light]
    const dimmedColor = theme.colors[node.color][3]

    return node && (
        <Box px="0.5em" py="0.25em" bg="white" pos="relative" sx={{
            border: `2px solid ${mainColor}`,
            borderRadius: theme.radius.sm,
            cursor: "grab",
        }} >
            <Group position="apart">
                <Group spacing="0.5em" >
                    <node.icon size="1.2em" color={mainColor} />
                    <Text size="sm" weight={600} color={mainColor} transform="uppercase" ff="Rubik">
                        {node.name}
                    </Text>
                </Group>
                {node.tags[0] && node.showMainTagInMenu &&
                    <Text size="sm" weight={500} color={dimmedColor} transform="uppercase" ff="Rubik">
                        {node.tags[0]}
                    </Text>}
            </Group>

            {pinned &&
                <Center p={8} pos="absolute" right={0} top="50%" sx={{ transform: "translate(100%, -50%)" }}>
                    <Tooltip label="Unpin" position="right">
                        <ActionIcon radius="sm" size="sm">
                            <TbPinned color={theme.colors.gray[theme.primaryShade.light]} />
                        </ActionIcon>
                    </Tooltip>
                </Center>}
        </Box >
    )
}
