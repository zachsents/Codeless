import { Box, Container, Stack } from "@mantine/core"


export default function Section({
    children,
    withBorder = false,
    stack = false, spacing, stackProps = {},
    size = "md", containerProps = {},
    className = "",
    ...props
}) {

    const borderClasses = `border-1 border-solid border-gray-400 ${className}`
    const allClasses = `${withBorder ? borderClasses : ""} ${className}`

    return (
        <Box w="100%" {...props} className={allClasses}>
            <Container size={size} {...containerProps}>
                {stack ?
                    <Stack spacing={spacing} {...stackProps}>{children}</Stack> :
                    children}
            </Container>
        </Box>
    )
}
