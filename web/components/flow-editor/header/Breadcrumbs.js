import { useAppContext, useFlowContext } from "@web/modules/context"
import { openContextModal } from "@mantine/modals"
import { ActionIcon, Box, Group, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core"
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

    const tinyFont = "0.6rem"

    return app && flow && (
        <Box>
            <Group spacing="xs">
                <Link href={`/app/${app?.id}`}>
                    <Text size={tinyFont} color="dimmed">{app?.name}</Text>
                </Link>

                <Text size="xs" color="dimmed" mb={-4}><TbChevronRight /></Text>

                <Link href={`/app/${app?.id}?tab=flows`}>
                    <Text size={tinyFont} color="dimmed">Workflows</Text>
                </Link>

                <Text size="xs" color="dimmed" mb={-4}><TbChevronRight /></Text>
            </Group>

            <Group>
                <Text size="lg" weight={500} color={theme.primaryColor}>
                    {flow?.name}
                </Text>
                <Tooltip label="Rename Workflow">
                    <ActionIcon onClick={openRenameModal} variant="transparent">
                        <TbPencil />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Box>
    )
}
