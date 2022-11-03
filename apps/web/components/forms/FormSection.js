import { Stack, Title } from '@mantine/core'

export default function FormSection({ title, children }) {
    return (
        <Stack align="center" mb={30}>
            {title && <Title order={2} mb={10}>{title}</Title>}
            {children}
        </Stack>
    )
}