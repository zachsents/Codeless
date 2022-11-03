import { Text } from '@mantine/core'

export default function FormSubsection({ label, children }) {
    return <>
        <Text color="dimmed">{label}</Text>
        {children}
        {/* <Space h={10} /> */}
    </>
}