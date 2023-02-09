import { Button } from "@mantine/core"
import React from "react"

export default function GlassButton({ children, radius = "xl", animate = true, ...props }) {
    return (
        <Button
            {...props}
            sx={{
                backgroundColor: "#fff3",
                color: "white",
                outline: "0px solid #fff1",
                transition: "all 0.3s",
                "&:hover": animate ? {
                    outline: "6px solid #fff1",
                } : {},
            }}
            variant="white"
            radius={radius}
        >
            {children}
        </Button>
    )
}
