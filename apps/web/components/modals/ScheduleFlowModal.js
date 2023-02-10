import { useState } from "react"
import { Button, Center, Group, Space, Text, useMantineTheme } from "@mantine/core"
import { useForm } from "@mantine/form"
import { Calendar, TimeInput } from "@mantine/dates"
import { TbCheck, TbClock } from "react-icons/tb"
import { scheduleFlowRun } from "@minus/client-sdk"


export function ScheduleFlowModal({ context, id, innerProps: { flowId } }) {

    const theme = useMantineTheme()

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            date: null,
            time: null,
        },
        validate: {
            date: value => !value,
            time: (value, values) => !value ||
                // if it's in the past
                values.date.setHours(value.getHours(), value.getMinutes()) <= new Date(),
        }
    })

    const handleSubmit = async values => {
        setLoading(true)

        // combine date and time
        values.date.setHours(values.time.getHours(), values.time.getMinutes())

        await scheduleFlowRun(flowId, values.date)
        context.closeModal(id)
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Text weight={500} mb={10}>Pick a date</Text>
            <Center>
                <Calendar
                    size="md"
                    minDate={new Date()}
                    weekendDays={[]}
                    dayStyle={calendarDayStyle(theme)}
                    {...form.getInputProps("date")}
                />
            </Center>
            <Space h="xl" />
            <Text weight={500} mb={10}>Pick a time</Text>
            <TimeInput
                clearable
                format="12"
                icon={<TbClock />}
                size="xl"
                {...form.getInputProps("time")}
                sx={{
                    "& .mantine-AmPmInput-amPmInput": {
                        width: "3ch"
                    }
                }}
            />
            <Space h={30} />
            <Group position="apart">
                <Button onClick={() => context.closeModal(id)} variant="subtle" color="red">Cancel</Button>
                <Button loading={loading} type="submit" leftIcon={<TbCheck />}>Schedule</Button>
            </Group>
        </form>
    )
}


/**
 * Calculates day styles for calendar based on passed date
 *
 * @param {Date} date
 * @return {*} 
 */
const calendarDayStyle = theme => (date, modifiers) => {
    return {
        backgroundColor: isToday(date) && !modifiers.selected ? theme.colors.indigo[1] : undefined,
        // color: modifiers.weekend && (modifiers.selected ? "white" : theme.colors.gray[7]),
    }
}


/**
 * Checks whether the passed date is today's date or not.
 *
 * @param {Date} date The date to test
 * @return {boolean} Whether or not the passed date is today 
 */
function isToday(date) {
    return date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)
}
