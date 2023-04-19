import { ActionIcon, Box, Button, Group, Stack, Text, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core"
import { runFlow } from "@minus/client-sdk"
import SlidingCard from "@web/components/SlidingCard"
import { openDataViewer } from "@web/components/modals/DataViewerModal"
import { useReplayContext } from "@web/modules/context"
import { useFlowId } from "@web/modules/hooks"
import { formatRunStatus, runStatusColor, runStatusIcon, shortRunId } from "@web/modules/runs"
import { useState } from "react"
import { TbClipboardData, TbPlayerPlay, TbX } from "react-icons/tb"


export default function CurrentRunCard() {

    const theme = useMantineTheme()

    const flowId = useFlowId()
    const { run, setRunId } = useReplayContext()

    const [rerunLoading, setRerunLoading] = useState(false)

    const runFlowWithSamePayload = async () => {
        setRerunLoading(true)
        const { runId } = await runFlow(flowId, run.payload)
        setRunId(runId)
        setRerunLoading(false)
    }

    return (
        <SlidingCard opened={!!run} withBorder>
            <Stack>
                <Group position="apart" align="start">
                    <Stack spacing="xs">
                        <Box>
                            <Text size="lg" weight={500}>
                                Viewing run <Text span weight={600} color={theme.primaryColor} ff="monospace">
                                    {shortRunId(run.id)}
                                </Text>
                            </Text>
                            <Text size="sm" color="dimmed">
                                {run.ranAt.toDate().toLocaleString(undefined, {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </Text>
                        </Box>
                        <Group spacing="xs">
                            <ThemeIcon color={runStatusColor(run.status)} size="sm" radius="xl">
                                {runStatusIcon(run.status)}
                            </ThemeIcon>
                            <Text size="sm" color="dimmed">
                                {formatRunStatus(run.status)}
                            </Text>
                        </Group>
                    </Stack>

                    <Tooltip label="Exit Run Viewer">
                        <ActionIcon
                            onClick={() => setRunId(null)}
                            size="lg" color="red" variant="subtle"
                        >
                            <TbX />
                        </ActionIcon>
                    </Tooltip>
                </Group>

                <Group>
                    <Tooltip label="View Trigger Data">
                        <Button
                            onClick={() => openDataViewer(run.payload, {
                                title: "Trigger Data for Run " + shortRunId(run.id),
                            })}
                            variant="light" color="gray" leftIcon={<TbClipboardData />}
                        >
                            Trigger Data
                        </Button>
                    </Tooltip>
                    <Tooltip label="Re-Run Trigger">
                        <Button
                            onClick={runFlowWithSamePayload}
                            loading={rerunLoading}
                            variant="light" leftIcon={<TbPlayerPlay />}
                        >
                            Re-Run
                        </Button>
                    </Tooltip>
                </Group>
            </Stack>
        </SlidingCard>
    )
}
