import { Group, Text, Tooltip } from "@mantine/core"
import { InfoCircle } from "tabler-icons-react"


export default function ControlLabel({ children, bold = false, info }) {
    return (
        <Group position="apart">
            <Text size="sm" weight={bold ? 500 : 400}>{children}</Text>
            {info &&
                <Tooltip
                    withinPortal
                    label={typeof info == "string" ?
                        <Text maw={300}>{info}</Text> : info}
                    position="left"
                    multiline
                    maw={500}
                >
                    <Text color="dimmed" size="sm" mb={-5}><InfoCircle size={15} /></Text>
                </Tooltip>}
        </Group>
    )
}