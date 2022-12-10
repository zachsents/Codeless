import { Group, Stack, Text, Tooltip } from "@mantine/core";
import { InfoCircle } from "tabler-icons-react";


export function ControlStack({ children, w = 180, ...props }) {
    return (
        <Stack w={w} {...props}>
            {children}
        </Stack>
    )
}

export function ControlLabel({ children, bold = false, info }) {
    return (
        <Group position="apart">
            <Text size="sm" weight={bold ? 500 : 400}>{children}</Text>
            {info &&
                <Tooltip label={info}>
                    <Text color="dimmed" size="sm" mb={-5}><InfoCircle size={15} /></Text>
                </Tooltip>}
        </Group>
    )
}

export function Control({ children, ...props }) {
    return (
        <Stack spacing={5} {...props}>
            {children}
        </Stack>
    )
}