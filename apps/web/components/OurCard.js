import { Card } from '@mantine/core'

export default function OurCard({ children, ...props }) {

    return (
        <Card
            p="xl"
            shadow="sm"
            sx={{ overflow: "visible" }}
            {...props}
        >
            {children}
        </Card>
    )
}
