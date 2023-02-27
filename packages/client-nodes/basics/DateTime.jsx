import { useEffect, useState } from "react"
import { CalendarTime, Clock } from "tabler-icons-react"
import { Stack } from "@mantine/core"
import { Calendar, TimeInput } from "@mantine/dates"

import { useNodeState } from "@minus/graph-util"


export default {
    id: "basic:DateTime",
    name: "Date & Time",
    description: "Giving you the time of day.",
    icon: CalendarTime,

    inputs: [],
    outputs: ["$"],

    defaultState: { $: new Date().getTime() },

    renderName: () => {

        const [state] = useNodeState()

        return new Date(state.$).toLocaleString(undefined, {
            timeStyle: "short",
            dateStyle: "short",
        })
    },

    configuration: () => {

        const [state, setState] = useNodeState()

        const [date, setDate] = useState(state.$ ? new Date(state.$) : null)
        const [time, setTime] = useState(state.$ ? new Date(state.$) : null)

        useEffect(() => {
            date && time && setState({ $: date.setHours(time.getHours(), time.getMinutes()) })
        }, [date, time])

        return (
            <Stack>
                <Calendar
                    size="xs"
                    weekendDays={[]}
                    value={date}
                    onChange={setDate}
                />
                <TimeInput
                    clearable
                    format="12"
                    value={time}
                    onChange={setTime}
                    icon={<Clock />}
                    sx={{
                        "& .mantine-AmPmInput-amPmInput": {
                            width: "3ch"
                        }
                    }}
                />
            </Stack>
        )
    },
}