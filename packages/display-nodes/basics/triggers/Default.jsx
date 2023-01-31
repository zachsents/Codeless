import { useState } from 'react'
import { Button, Center, Group, Modal, Space, Text, useMantineTheme } from '@mantine/core'
import { openModal, closeAllModals } from "@mantine/modals"
import { Calendar, TimeInput } from "@mantine/dates"
import { TbCheck, TbClock } from 'react-icons/tb'
import { useForm } from '@mantine/form'
import { httpsCallable } from 'firebase/functions'
import { Run, Clock } from "tabler-icons-react"


export default {
    id: "basic:DefaultTrigger",
    name: "Trigger",
    description: "Can be triggered manually, triggered by other flows, or scheduled to run later.",
    icon: Run,
    
    inputs: [],
    outputs: ["$"],
    
    deletable: false,

    controls: [
        {
            label: "Run Now",
            icon: Run,

            onClick: async ({ appId, flow, functions, loading, setLoading, success, setSuccess, error, setError }) => {

                setLoading(true)
                console.debug(`Running "${flow.name}" (${flow.id}) manually...`)

                const { data } = await httpsCallable(functions, "runNow")({ appId, flowId: flow.id })

                setLoading(false)

                if (Object.keys(data.errors ?? {}).length > 0) {
                    setError(true)
                    console.debug("😢 Returned errors:\n", data.errors)
                }
                else
                    setSuccess(true)

                console.debug("Done. Here's the response:")
                console.debug(data)

                setTimeout(() => {
                    setError(false)
                    setSuccess(false)
                }, 2000)
            }
        },
        {
            label: "Run Later",
            icon: Clock,

            onClick: ({ flow, ...props }) => openModal({
                title: `Schedule "${flow.name}"`,
                children: <ScheduleModal flow={flow} {...props} />
            })
        },
    ]
}


function ScheduleModal({ appId, flow, functions }) {

    const theme = useMantineTheme()

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

    const [loading, setLoading] = useState(false)

    const handleSubmit = values => {

        // combine date and time
        values.date.setHours(values.time.getHours(), values.time.getMinutes())

        setLoading(true)
        console.debug(`Scheduling "${flow.name}" (${flow.id}) at ${values.date.toLocaleString()}...`)

        // call schedule function
        httpsCallable(functions, "runLater")({
            appId,
            flowId: flow.id,
            time: values.date.getTime()
        })
            .then(({ data: { message, error } }) => {
                handleCancel()

                if (error) {
                    console.debug(`😢 Returned an error:\n${error}`)
                    return
                }

                console.debug("Done. Here's the response:")
                console.debug(message)
            })
            .catch(error => {
                console.error(error)
                form.setErrors({ time: "There was an error on our end. We'll get this fixed ASAP!" })
                setLoading(false)
            })
    }

    const handleCancel = () => {
        form.setValues({ date: null, time: null })
        setLoading(false)
        closeAllModals()
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
                <Button onClick={handleCancel} variant="subtle" color="red">Cancel</Button>
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
