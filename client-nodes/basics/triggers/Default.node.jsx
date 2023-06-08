import { ActionIcon, Button, Center, Divider, Group, Loader, Menu, Popover, ScrollArea, SegmentedControl, Stack, Text, Title, Tooltip, useMantineTheme } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import { useClickOutside, useDisclosure } from "@mantine/hooks"
import { cancelScheduledRun, runFlow, scheduleFlowRun, useActionQuery, useScheduledRuns } from "@minus/client-sdk"
import { useEffect } from "react"
import { TbAlertTriangle, TbArrowBounce, TbCalendar, TbClock, TbClockEdit, TbClockPlay, TbConfetti, TbDots, TbMoodSad, TbPlus, TbRotateClockwise2, TbRun, TbTrash, TbX } from "react-icons/tb"
import { notifications } from "@mantine/notifications"
import { Run } from "tabler-icons-react"
import { useForm } from "@mantine/form"
import { DateTimePicker } from "@mantine/dates"
import ScheduleBuilder from "../../components/ScheduleBuilder"
import { plural } from "@minus/util"


export default {
    id: "basic:DefaultTrigger",
    name: "On a schedule",
    description: "Can be scheduled, triggered by other flows, or run manually.",
    icon: Run,

    tags: ["Trigger"],
    showMainTag: true,
    showSettingsIcon: false,

    inputs: [],
    outputs: [
        {
            id: "$",
            name: "Payload",
            description: "The payload of the flow run.",
            tooltip: "The payload of the flow run.",
            defaultShowing: false,
        },
    ],

    creatable: false,
    trigger: true,
    deletable: false,

    renderContent: () => <Text size="xs" color="dimmed" maw="20rem">
        Everything in this workflow will run.
    </Text>,

    flowControls: [
        {
            id: "run-now",
            label: "Run Now",
            icon: TbRun,
            small: true,
            showStatus: true,

            render: ({ flow }) => {

                const [run, query] = useActionQuery(async () => {

                    console.debug(`Running "${flow.name}"...`)

                    const { runId, finished } = await runFlow(flow.id, null)
                    console.debug(`Created run ${runId}`)

                    const flowRun = await finished
                    console.debug("Entire Run:", flowRun)

                    if (flowRun.returns.logs) {
                        console.groupCollapsed("Run Logs")
                        flowRun.returns.logs.forEach(log => console.log(log))
                        console.groupEnd()
                    }

                    switch (flowRun.status) {
                        case "finished":
                            notifications.show({
                                title: "Successfully ran!",
                                color: "green",
                                icon: <TbConfetti />,
                                message: "Click a node to view its output."
                            })
                            break
                        case "finished-with-errors":
                            notifications.show({
                                title: "Finished with errors",
                                color: "yellow",
                                icon: <TbAlertTriangle />,
                                message: "This workflow finished, but with errors. Some actions may not have run."
                            })
                            break
                        case "failed":
                            notifications.show({
                                title: "Failed!",
                                color: "red",
                                icon: <TbMoodSad />,
                                message: "The workflow failed to run. This is likely a problem on our end."
                            })
                            throw new Error("Flow failed.")
                    }
                }, ["run", flow.id], {
                    retry: false,
                })

                return (
                    <Button
                        leftIcon={<TbRun />} variant="light"
                        onClick={() => run()} loading={query.isFetching}
                    >
                        Run Now
                    </Button>
                )
            },
        },
        {
            id: "schedule-flow",
            label: "Run Later",
            icon: TbCalendar,
            small: true,
            showStatus: false,

            render: ({ flow }) => {

                const theme = useMantineTheme()

                // Popover state
                const [opened, popoverHandlers] = useDisclosure(false)
                const clickOutsideRef = useClickOutside(popoverHandlers.close, ["pointerdown"])

                // Form state
                const form = useForm({
                    initialValues: {
                        type: "once",
                        datetime: null,
                        schedule: null,
                    },
                    validate: {
                        datetime: value => form.values.type == "once" && (
                            !value ||
                            value <= new Date() // if it's in the past
                        ),
                        schedule: value => form.values.type == "recurring" && (
                            !value ||
                            Object.values(value).some(v => v === null)
                        ),
                    },
                    validateInputOnChange: true,
                })

                // Submit query
                const [handleSubmit, submitQuery] = useActionQuery(async () => {

                    const runId = await scheduleFlowRun(flow.id, {
                        recurring: form.values.type == "recurring",
                        ...(form.values.type == "once" && { scheduledFor: form.values.datetime }),
                        ...(form.values.type == "recurring" && { schedule: form.values.schedule }),
                    })

                    console.debug(`Scheduled run ${runId}`)

                    notifications.show({
                        title: "Scheduled!",
                        color: "green",
                        icon: <TbClockPlay />,
                        message: "Your workflow has been scheduled."
                    })

                }, ["schedule-flow", flow.id])

                // Query list of scheduled runs
                const [scheduledRuns] = useScheduledRuns(flow.id)

                return (
                    <div ref={clickOutsideRef}>
                        <Popover
                            shadow="lg"
                            opened={opened} onOpen={popoverHandlers.open} onClose={popoverHandlers.close}
                        >
                            <Popover.Target>
                                <Button
                                    leftIcon={<TbClockEdit />} variant="light"
                                    onClick={popoverHandlers.toggle}
                                >
                                    Setup Schedule
                                </Button>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Stack w="24rem" pb="xs">
                                    <form onSubmit={form.onSubmit(() => handleSubmit())}>
                                        <Stack spacing="sm">
                                            <Group spacing="sm">
                                                <TbPlus />
                                                <Text weight={500}>Add a schedule</Text>
                                            </Group>

                                            <SegmentedControl
                                                {...form.getInputProps("type")}
                                                data={[
                                                    {
                                                        label: <Group noWrap spacing="xs" pl="xs" pr="md" position="center">
                                                            <TbArrowBounce />
                                                            <Text>One-time</Text>
                                                        </Group>,
                                                        value: "once",
                                                    },
                                                    {
                                                        label: <Group noWrap spacing="xs" pl="xs" pr="md" position="center">
                                                            <TbRotateClockwise2 />
                                                            <Text>Recurring</Text>
                                                        </Group>,
                                                        value: "recurring",
                                                    },
                                                ]}
                                            />

                                            {form.values.type == "once" &&
                                                <DateTimePicker
                                                    {...form.getInputProps("datetime")}
                                                    clearable
                                                    valueFormat={theme.other.dateTimeFormat}
                                                    placeholder="Pick a date and time"
                                                    popoverProps={{ shadow: "lg" }}
                                                />}

                                            {form.values.type == "recurring" &&
                                                <ScheduleBuilder
                                                    {...form.getInputProps("schedule")}
                                                />}

                                            <Center>
                                                <Button
                                                    type="submit" leftIcon={<TbPlus />} radius="xl"
                                                    disabled={!form.isValid()}
                                                    loading={submitQuery.isFetching}
                                                >
                                                    {form.values.type == "once" && "Add One-Time Schedule"}
                                                    {form.values.type == "recurring" && "Add Recurring Schedule"}
                                                </Button>
                                            </Center>
                                        </Stack>
                                    </form>

                                    <Divider />

                                    <Stack spacing="sm">
                                        <Group spacing="sm">
                                            <TbClock />
                                            <Text weight={500}>Current Schedule</Text>
                                        </Group>
                                        <ScrollArea.Autosize mah="20rem">
                                            <Stack spacing="sm">
                                                {scheduledRuns ?
                                                    scheduledRuns.length > 0 ?
                                                        scheduledRuns.map(run => <RunRow run={run} key={run.id} />) :
                                                        <Text size="sm" color="dimmed" align="center">No runs scheduled</Text> :
                                                    <Center>
                                                        <Loader size="sm" />
                                                    </Center>}
                                            </Stack>
                                        </ScrollArea.Autosize>
                                    </Stack>
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>
                    </div>
                )
            },
        },
    ]
}


function RunRow({ run }) {

    // Cancelling a run
    const [cancelRun, cancelQuery] = useActionQuery(async () => {
        await cancelScheduledRun(run.id)

        notifications.show({
            title: "Cancelled!",
            color: "primary",
            icon: <TbX />,
            message: "Your scheduled run has been cancelled."
        })
    }, ["cancel-run", run.id])

    return (
        <Group position="apart" noWrap px="lg" key={run.id}>
            <Group spacing="sm" noWrap>
                {run.recurring ? <TbRotateClockwise2 /> : <TbArrowBounce />}

                {run.recurring ?
                    <Stack spacing={0}>
                        <Text>
                            Every {run.schedule.interval} {plural(run.schedule.intervalUnit, run.schedule.interval)}
                        </Text>
                        <Text size="sm" color="dimmed">
                            Next run at {run.scheduledFor.toDate().toLocaleString("en", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </Text>
                    </Stack> :
                    <Stack spacing={0}>
                        <Text>One-time</Text>
                        <Text size="sm" color="dimmed">
                            {run.scheduledFor.toDate().toLocaleString("en", {
                                dateStyle: "medium",
                                timeStyle: "short",
                            })}
                        </Text>
                    </Stack>}
            </Group>

            {cancelQuery.isFetching ?
                <Loader size="xs" /> :
                <Menu withinPortal shadow="sm">
                    <Menu.Target>
                        <ActionIcon size="md" variant="light">
                            <TbDots />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item color="red" icon={<TbX />} onClick={cancelRun}>
                            Cancel
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>}
        </Group>
    )
}