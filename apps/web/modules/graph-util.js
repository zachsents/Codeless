import { Group, Text, Title } from "@mantine/core"
import { openContextModal } from "@mantine/modals"


export function openNodePalette(rf, {
    innerProps = {},
    subtitle,
    ...props
} = {}) {
    openContextModal({
        modal: "NodePalette",
        innerProps: {
            rf,
            ...innerProps,
        },
        title: <Group>
            <Title order={3}>Add a node</Title>
            {subtitle &&
                <Text color="dimmed">{subtitle}</Text>}
        </Group>,
        size: "lg",
        centered: true,
        transitionDuration: 200,
        ...props,
    })
}
