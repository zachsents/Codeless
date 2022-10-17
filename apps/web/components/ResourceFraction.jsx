import { Group, Stack, Text } from '@mantine/core'
import React from 'react'

export default function ResourceFraction({ used, total, label, color }) {
    return (
        <Stack align="center" spacing={3}>
            <Group spacing={6} position="center" sx={{ alignItems: "baseline" }}>
                <Text size="xl" weight={700} color={color}>{used}</Text>
                <Text size="xs">/ {total}</Text>
            </Group>
            <Text size="sm" weight={700} transform="uppercase" color={color} >{label}</Text>
        </Stack>
    )
}
