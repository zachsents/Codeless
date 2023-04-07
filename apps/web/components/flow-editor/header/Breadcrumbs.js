import { useAppContext, useFlowContext } from "@web/modules/context"
import { openContextModal } from "@mantine/modals"
import { ActionIcon, Group, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core"
import { TbChevronRight, TbPencil } from "react-icons/tb"
import Link from "next/link"


export default function Breadcrumbs() {

    const theme = useMantineTheme()

    const { app } = useAppContext()
    const { flow } = useFlowContext()

    const openRenameModal = () => {
        openContextModal({
            modal: "RenameFlow",
            innerProps: { flowId: flow?.id, oldName: flow?.name },
            title: <Title order={3}>Rename "{flow?.name}"</Title>,
            size: "lg",
        })
    }

    return app && flow && (
        <Stack spacing={0}>
            <Group spacing="xs">
                <Link href={`/apps/${app?.id}`}>
                    <Text size="xs" color="dimmed">{app?.name}</Text>
                </Link>
                <Text size="xs" color="dimmed" pt={3}><TbChevronRight /></Text>
                <Link href={`/apps/${app?.id}/flows`}>
                    <Text size="xs" color="dimmed">Flows</Text>
                </Link>
                <Text size="xs" color="dimmed" pt={3}><TbChevronRight /></Text>
            </Group>
            <Group>
                <Text size="lg" weight={500} color={theme.primaryColor}>
                    {flow?.name}
                </Text>
                <Tooltip label="Rename Flow">
                    <ActionIcon onClick={openRenameModal} variant="transparent">
                        <TbPencil />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Stack>
    )
}
