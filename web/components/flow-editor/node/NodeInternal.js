import { Badge, Divider, Group, Stack, Text } from "@mantine/core"
import { useColors, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"

export default function NodeInternal({ displayProps }) {

    const typeDefinition = useTypeDefinition()
    const [mainColor] = useColors(null, ["primary"])

    return (
        <Stack spacing="xs" h="100%">
            {typeDefinition.renderName &&
                <Group position="apart" spacing="xl" className="flex-auto">
                    <Group>
                        {/* Icon */}
                        <typeDefinition.icon color={mainColor} size={24} strokeWidth={1.5} />

                        {/* Name */}
                        <Text size="sm" weight={500}>
                            <typeDefinition.renderName {...displayProps} />
                        </Text>
                    </Group>

                    {/* Tags */}
                    {typeDefinition.tags[0] && typeDefinition.showMainTag &&
                        <Badge size="sm" color={typeDefinition.color} >
                            {typeDefinition.tags[0]}
                        </Badge>}
                </Group>}

            {(typeDefinition.renderTextContent || typeDefinition.renderContent) &&
                <Divider />}

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
