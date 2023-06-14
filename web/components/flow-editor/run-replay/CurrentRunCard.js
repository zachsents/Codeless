import { ActionIcon, Box, Button, Group, Stack, Text, ThemeIcon, Tooltip, useMantineTheme } from "@mantine/core"
import { runFlow } from "@minus/client-sdk"
import SlidingCard from "@web/components/SlidingCard"
import { useReplayContext } from "@web/modules/context"
import { useFlowId } from "@web/modules/hooks"
import { RunStatusIcon, formatRunStatus, runStatusColor, shortRunId } from "@web/modules/runs"
import { useEffect, useState } from "react"
import { TbPlayerPlay, TbX } from "react-icons/tb"


export default function CurrentRunCard() {

    const theme = useMantineTheme()

    const flowId = useFlowId()
    const { run, setRunId, runs } = useReplayContext()

    const [rerunLoading, setRerunLoading] = useState(false)

    const runFlowWithSamePayload = () => {
        setRerunLoading(true)
        runFlow(flowId, run.payload)
    }

    // side-effect: stop loading when run changes
    useEffect(() => {
        setRerunLoading(false)
    }, [run?.id])

    // side-effect: when runs change, select the latest
    useEffect(() => {
        if (runs?.length)
            setRunId(runs[0].id)
    }, [runs?.map(run => run.id).join()])

    return (
        <SlidingCard opened={!!run}
            withBorder miw="12rem" p="xs" shadow="md" className="pointer-events-auto"
            key={run?.id}
        >
            <Stack>
                <Group position="apart" align="start" noWrap>
                    <Stack spacing="xs">
                        <Box>
                            <Text size="sm" weight={500}>
                                Viewing run <Text span weight={600} color={theme.primaryColor} ff="monospace">
                                    {shortRunId(run.id)}
                                </Text>
                            </Text>
                            <Text size="xs" color="dimmed">
                                {run.ranAt.toDate().toLocaleString(undefined, {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                })}
                            </Text>
                        </Box>
                        <Group spacing="xs">
                            <ThemeIcon color={runStatusColor(run.status)} size="sm" radius="xl">
                                <RunStatusIcon status={run.status} />
                            </ThemeIcon>
                            <Text size="xs" color="dimmed">
                                {formatRunStatus(run.status)}
                            </Text>
                        </Group>
                    </Stack>

                    <Tooltip label="Close Run Viewer">
                        <ActionIcon
                            onClick={() => setRunId(null)}
                            size="md" color="red" variant="subtle"
                        >
                            <TbX />
                        </ActionIcon>
                    </Tooltip>
                </Group>

                <Stack spacing="xs">
                    <Tooltip withinPortal label="Run this flow again with the same trigger data.">
                        <Button
                            onClick={runFlowWithSamePayload}
                            loading={rerunLoading}
                            variant="light" leftIcon={<TbPlayerPlay />} size="xs"
                        >
                            {rerunLoading ? "Running" : "Re-Run This Trigger"}
                        </Button>
                    </Tooltip>
                </Stack>
            </Stack>
        </SlidingCard>
    )
}
