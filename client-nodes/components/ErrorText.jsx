import { Text } from "@mantine/core"


export default function ErrorText({ children, hideWhen }) {
    return !hideWhen && <Text size="xs" color="red.7" align="center">{children}</Text>
}
