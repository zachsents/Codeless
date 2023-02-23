import { Group, ThemeIcon, Text } from "@mantine/core"
import { TbAlertTriangle, TbExclamationMark } from "react-icons/tb"


export default function ProblemRow({ children, type = "error" }) {

    const color = type == "error" ? "red" : "yellow"
    const icon = type == "error" ? <TbExclamationMark /> : <TbAlertTriangle />

    return (
        <Group noWrap align="center">
            <ThemeIcon size="sm" radius="sm" color={color} variant="light">
                {icon}
            </ThemeIcon>
            <Text size="sm">{children}</Text>
        </Group>
    )
}
