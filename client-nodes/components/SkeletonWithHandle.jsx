import { forwardRef } from "react"
import { Box } from "@mantine/core"


const SkeletonWithHandle = forwardRef(({ align = "left", h = 15, ...props }, ref) => {

    return (
        <Box
            w="100%"
            justify="center"
            align="center"
            sx={{ position: "relative" }}
            ref={ref}
        >
            <Box
                sx={theme => ({
                    width: "100%",
                    height: h,
                    backgroundColor: theme.colors.gray[2],
                    borderRadius: h / 2,
                })}
                {...props}
            ></Box>
            <Box
                sx={theme => ({
                    width: align == "both" ? `calc(100% + ${theme.spacing.md * 2}px)` : "50%",
                    height: 3,
                    position: "absolute",
                    top: "50%",
                    [align == "right" ? "right" : "left"]: -theme.spacing.md,
                    transform: "translateY(-50%)",
                    background: theme.colors.gray[2],
                })}
            ></Box>
        </Box>
    )
})

SkeletonWithHandle.displayName = "SkeletonWithHandle"

export default SkeletonWithHandle