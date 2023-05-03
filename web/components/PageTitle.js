import { Title } from "@mantine/core"

export default function PageTitle({ children, white, mb = 30, ...props }) {
    return (
        <Title
            order={1}
            color={white ? "white" : undefined}
            mb={mb}
            {...props}
        >
            {children}
        </Title>
    )
}
