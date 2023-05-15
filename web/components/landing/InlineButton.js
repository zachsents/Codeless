import { Button, useMantineTheme } from "@mantine/core"

export default function InlineButton({ children, active = false, ...props }) {

    const theme = useMantineTheme()

    return (
        <Button
            compact radius="sm" component="span"
            variant="light" color={active ? `${theme.primaryColor}.9` : "dark"} bg={active ? `${theme.primaryColor}.2` : "gray.3"}
            {...props}>
            {children}</Button>
    )
}