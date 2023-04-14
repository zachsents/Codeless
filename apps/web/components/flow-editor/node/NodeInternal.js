import { Group, Stack, Text } from "@mantine/core"
import { useColors, useTypeDefinition } from "@minus/client-nodes/hooks/nodes"

export default function NodeInternal({ displayProps }) {

    const typeDefinition = useTypeDefinition()
    const [mainColor, dimmedColor] = useColors(null, ["primary", 3])

    return (
        <Stack>
            {typeDefinition.renderName &&
                <Group position="apart">
                    <Group>
                        {/* Icon */}
                        <typeDefinition.icon color={mainColor} size={24} />

                        {/* Name */}
                        <Text size="sm" weight={600} color={typeDefinition.color} transform="uppercase" ff="Rubik">
                            <typeDefinition.renderName {...displayProps} />
                        </Text>
                    </Group>

                    {/* Tags */}
                    {typeDefinition.tags[0] && typeDefinition.showMainTag &&
                        <Text size="sm" weight={500} color={dimmedColor} transform="uppercase" ff="Rubik">
                            {typeDefinition.tags[0]}
                        </Text>}
                </Group>}

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
