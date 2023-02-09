import { Box, Skeleton } from "@mantine/core"
import React from "react"

export default function LoadingSkeleton({ size = 3 }) {

    return (
        <Box sx={{ maxWidth: 500 }}>
            {Array.from(Array(size - 1), (_, i) => <Skeleton height={8} mt={6} radius="xl" key={i} />)}
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Box>
    )
}
