import { forwardRef } from "react"
import {Stack} from "@mantine/core"
import { Position } from "reactflow"


const VerticalContainer = forwardRef(({ children, position, ...props }, ref) => {
    return (
        <Stack
            justify="center"
            sx={stackStyle(position)}
            {...props}
        >
            <Stack
                justify="space-evenly"
                align="center"
                spacing={0}
                ref={ref}
            >
                {children}
            </Stack>
        </Stack>
    )
})

VerticalContainer.displayName = "Handle.VerticalContainer"

export default VerticalContainer


const stackStyle = position => ({
    position: "absolute",
    top: "50%",
    zIndex: 10,
    minHeight: "100%",

    ...(position == Position.Left && {
        left: 0,
        transform: "translate(-50%, -50%)",
    }),
    ...(position == Position.Right && {
        right: 0,
        transform: "translate(50%, -50%)",
    }),
})