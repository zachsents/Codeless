import { Divider, Group, Stack, Text, ThemeIcon } from "@mantine/core"
import { useTypeDefinition } from "@minus/client-nodes/hooks/nodes"


export default function NodeInternal({ displayProps }) {

    const typeDefinition = useTypeDefinition()
    // const [mainColor] = useColors(null, ["primary"])

    return (
        <Stack spacing="xs" >
            {typeDefinition.renderName &&
                <Group position="apart" spacing="xl" className="flex-auto">
                    <Group>
                        {/* Icon */}
                        <ThemeIcon color={typeDefinition.color}>
                            <typeDefinition.icon size="1em" strokeWidth={1.5} />
                        </ThemeIcon>
                        {/* <typeDefinition.icon color={mainColor} size={24} strokeWidth={1.5} /> */}

                        {/* Name */}
                        <Text size="sm" weight={500}>
                            <typeDefinition.renderName {...displayProps} />
                        </Text>

                    </Group>

                    {/* Disabling this for now because settings show for selected node */}
                    {/* {typeDefinition.showSettingsIcon &&
                        <ActionIcon
                            size="sm" radius="sm" variant="light" className="nodrag"
                            onClick={() => setContextMenu(id)}
                        >
                            <TbSettings size="0.75em" />
                        </ActionIcon>} */}
                </Group>}

            {!!(typeDefinition.renderName && (typeDefinition.renderTextContent || typeDefinition.renderContent)) &&
                // last:hidden makes it so that the divider is not shown if there's nothing rendered beneath it
                <Divider className="last:hidden" />}

            {/* Text Content */}
            {typeDefinition.renderTextContent &&
                <Text align="center" size="lg" color="dimmed">
                    <typeDefinition.renderTextContent {...displayProps} />
                </Text>}

            {/* Content */}
            {typeDefinition.renderContent &&
                <typeDefinition.renderContent {...displayProps} />}
        </Stack>
    )
}
