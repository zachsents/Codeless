import { Group, Stack, Text, useMantineTheme } from "@mantine/core"
import { getNodeType } from "@web/modules/graph-util"

export default function NodeInternal({ type, displayProps }) {

    const theme = useMantineTheme()

    const typeDefinition = getNodeType({ type })
    const mainColor = theme.colors[typeDefinition.color][theme.primaryShade.light]
    const dimmedColor = theme.colors[typeDefinition.color][3]

    return (
        <Stack>
            {typeDefinition.renderName &&
                <Group position="apart">
                    <Group>
                        <typeDefinition.icon color={mainColor} size={24} />
                        {/* <ThemeIcon color={typeDefinition.color} size="sm" radius="xl">
                                            <typeDefinition.icon size={10} />
                                        </ThemeIcon> */}
                        <Text size="sm" weight={600} color={typeDefinition.color} transform="uppercase" ff="Rubik">
                            <typeDefinition.renderName {...displayProps} />
                        </Text>
                    </Group>

                    {typeDefinition.tags[0] && typeDefinition.showMainTag &&
                        <Text size="sm" weight={500} color={dimmedColor} transform="uppercase" ff="Rubik">
                            {typeDefinition.tags[0]}
                        </Text>}
                </Group>}

            {typeDefinition.renderTextContent &&
                <Text align="center" size="lg">
                    <typeDefinition.renderTextContent {...displayProps} />
                </Text>}

            {typeDefinition.renderContent &&
                <typeDefinition.renderContent {...displayProps} />}
        </Stack>
    )
}
