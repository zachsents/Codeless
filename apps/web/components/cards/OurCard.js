import { Card } from '@mantine/core'
import { forwardRef } from 'react'

const OurCard = forwardRef(({ children, ...props }, ref) => {

    return (
        <Card
            p="xl"
            shadow="xl"
            sx={{ overflow: "visible" }}
            {...props}
            ref={ref}
        >
            {children}
        </Card>
    )
})

OurCard.displayName = "OurCard"

export default OurCard