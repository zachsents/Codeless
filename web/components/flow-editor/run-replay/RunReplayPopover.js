import { Button, Center, Indicator, Popover, ScrollArea, Stack, Table, Text, ThemeIcon, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { isPending } from "@minus/client-sdk"
import { useReplayContext } from "@web/modules/context"
import { formatRunStatus, runStatusColor, runStatusIcon, shortRunId } from "@web/modules/runs"
import { TbClockPlay } from "react-icons/tb"
import styles from "./RunReplayPopover.module.css"


export default function RunReplayPopover() {

    const { setRunId, runs, runLimit, setRunLimit, run: selectedRun } = useReplayContext()
    const hasNoRuns = !runs?.length

    const [popoverOpened, popoverHandlers] = useDisclosure(false)

    return <Popover
        opened={popoverOpened}
        onClose={popoverHandlers.close}
        position="bottom-end" shadow="xl"
    >
        <Popover.Target>
            <Indicator
                disabled={hasNoRuns}
                color={!hasNoRuns && runStatusColor(runs[0].status)}
                processing={!hasNoRuns && isPending(runs[0].status)}
                size={12} offset={2} mr="sm"
            >
                <Button
                    onClick={popoverHandlers.toggle}
                    color={hasNoRuns && "gray"}
                    variant="light" size="md" leftIcon={<TbClockPlay size={24} />}
                >
                    View Runs
                </Button>
            </Indicator>
        </Popover.Target>
        <Popover.Dropdown px={0}>
            <ScrollArea.Autosize mah="80vh" classNames={{ viewport: styles.scrollViewport }}>
                <Stack miw={200}>
                    {hasNoRuns ?
                        <Stack spacing={0} py="md">
                            <Text weight={500} align="center">
                                No runs yet.
                            </Text>
                            <Text size="sm" align="center" color="dimmed">
                                Run your flow to see the results here.
                            </Text>
                        </Stack> :
                        <>
                            <Text weight={500}>Past Runs</Text>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {runs.map((run, i) => {
                                        const isRunSelected = run.id === selectedRun?.id

                                        return <Tooltip
                                            label={isRunSelected ? "Selected" : "Select Run"}
                                            position="left" withArrow withinPortal key={run.id}
                                        >
                                            <tr
                                                onClick={() => {
                                                    setRunId(run.id)
                                                    popoverHandlers.close()
                                                }}
                                                className={`${styles.runRow} ${isRunSelected ? styles.selectedRunRow : ""} ${i == 0 ? styles.first : ""}`}
                                            >
                                                <td>
                                                    <Text ff="monospace">
                                                        {shortRunId(run.id)}
                                                    </Text>
                                                </td>
                                                <td>{run.ranAt.toDate().toLocaleDateString(undefined, {
                                                    dateStyle: "short",
                                                })}</td>
                                                <td>{run.ranAt.toDate().toLocaleTimeString(undefined, {
                                                    timeStyle: "short",
                                                })}</td>
                                                <td>
                                                    <Center>
                                                        <Tooltip label={formatRunStatus(run.status)}>
                                                            <ThemeIcon
                                                                color={runStatusColor(run.status)}
                                                                size="sm" radius="xl"
                                                            >
                                                                {runStatusIcon(run.status)}
                                                            </ThemeIcon>
                                                        </Tooltip>
                                                    </Center>
                                                </td>
                                            </tr>
                                        </Tooltip>
                                    })}
                                </tbody>
                            </Table>

                            {runLimit < 20 &&
                                <Button
                                    onClick={() => setRunLimit(20)}
                                    variant="subtle" size="xs"
                                >
                                    Load More
                                </Button>}
                        </>}
                </Stack>
            </ScrollArea.Autosize>
        </Popover.Dropdown>
    </Popover>
}


