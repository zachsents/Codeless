import { Button, Group, Stack, Text, useMantineTheme } from "@mantine/core"
import { DateTimePicker } from "@mantine/dates"
import { useForm } from "@mantine/form"
import { scheduleFlowRun as _scheduleFlowRun } from "@minus/client-sdk"
import { TbCheck } from "react-icons/tb"
import { useQuery } from "react-query"


export default function ScheduleFlowModal({ context, id, innerProps: { flowId } }) {

    const theme = useMantineTheme()

    const form = useForm({
        initialValues: {
            datetime: null,
        },
        validate: {
            datetime: (value) => !value ||
                // if it's in the past
                value <= new Date(),
        },
        validateInputOnChange: true,
    })

    const { isLoading, refetch: scheduleFlowRun } = useQuery({
        queryKey: ["scheduleFlow", flowId, form.values.datetime?.toISOString()],
        queryFn: () => _scheduleFlowRun(flowId, form.values.datetime),
        onSuccess: () => context.closeModal(id),
        enabled: false,
        retry: false,
    })

    return (
        <form onSubmit={form.onSubmit(() => scheduleFlowRun())}>
            <Stack spacing="xs">
                <Text weight={500}>Run this flow at:</Text>
                <DateTimePicker
                    {...form.getInputProps("datetime")}
                    clearable
                    valueFormat={theme.other.dateTimeFormat}
                    placeholder="Pick a date and time"
                    popoverProps={{ withinPortal: true }}
                />
                <Group position="apart">
                    <Button onClick={() => context.closeModal(id)} variant="subtle" color="red">
                        Cancel
                    </Button>
                    <Button
                        loading={isLoading}
                        type="submit"
                        disabled={!form.isValid()}
                        leftIcon={<TbCheck />}
                    >
                        Schedule
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
