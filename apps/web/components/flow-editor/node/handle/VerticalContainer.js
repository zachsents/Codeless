import { Stack } from "@mantine/core"
import { forwardRef } from "react"


const VerticalContainer = forwardRef(({ children }, ref) => {
    return (
        <Stack
            w={0}
            justify="space-evenly"
            align="center"
            spacing={0}
            ref={ref}
        >
            {children}
        </Stack>
    )
})

VerticalContainer.displayName = "Handle.VerticalContainer"

export default VerticalContainer