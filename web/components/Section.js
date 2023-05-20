import { Box, Container, Stack } from "@mantine/core"
import { jc } from "@web/modules/util"


export default function Section({
    children,
    withBorder = false,
    stack = false, spacing, stackProps = {},
    size = "md", containerProps = {},
    className,
    ...props
}) {

    return (
        <Box component="section" w="100%" {...props} className={jc(
            withBorder && "base-border", className
        )}>
            <Container size={size} {...containerProps}>
                {stack ?
                    <Stack spacing={spacing} {...stackProps}>{children}</Stack> :
                    children}
            </Container>
        </Box>
    )
}
