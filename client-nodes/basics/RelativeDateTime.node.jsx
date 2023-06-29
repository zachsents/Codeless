import { CalendarTime } from "tabler-icons-react"
import DateTimeControl from "../components/DateTimeControl"
import { useInputValue } from "../hooks/nodes"
import { Group, NumberInput, Select, Text } from "@mantine/core"
import { useSetState } from "@mantine/hooks"
import { syncType } from "@minus/util"


export default {
    id: "basic:RelativeDateTime",
    name: "Relative Time",
    description: "An amount of time from the time the workflow runs.",
    icon: CalendarTime,

    tags: ["Time", "Basics"],
    showMainTag: false,

    inputs: [
        {
            id: "time",
            description: "The time from when the workflow runs.",
            tooltip: "The time from when the workflow runs.",
            icon: CalendarTime,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: {
                interval: 1,
                unit: "day",
            },
            renderConfiguration: ({ inputId }) => {

                const [value, setValue] = useInputValue(null, inputId)
                const setInterval = newValue => setValue({ ...value, interval: newValue })
                const setUnit = newValue => setValue({ ...value, unit: newValue })

                return (
                    <Group spacing="xs">
                        <Text size="sm">in</Text>
                        <NumberInput
                            name="interval"
                            placeholder="1" min={1}
                            value={syncType(value?.interval, "number", value?.interval, "")}
                            onChange={newValue => setInterval(syncType(newValue, "number", newValue, null))}
                            size="sm" w="4rem"
                        />
                        <Select
                            name="unit"
                            data={unitData(value?.interval)}
                            value={value?.unit ?? null}
                            onChange={newValue => setUnit(syncType(newValue, "string", newValue, null))}
                            size="sm" withinPortal
                        />
                    </Group>
                )
            },
        },
    ],
    outputs: [
        {
            id: "$",
            name: "Date/Time",
            description: "The date & time.",
            tooltip: "The date & time.",
        }
    ],

    renderName: () => {
        const [value] = useInputValue(null, "time")

        if (!value?.interval || !value?.unit)
            return "Relative Time"

        return `in ${value.interval} ${unitData(value.interval).find(unit => unit.value == value.unit).label}`
    },
}


function unitData(value) {
    return [
        { value: "minute", label: value == 1 ? "minute" : "minutes" },
        { value: "hour", label: value == 1 ? "hour" : "hours" },
        { value: "day", label: value == 1 ? "day" : "days" },
        { value: "week", label: value == 1 ? "week" : "weeks" },
        { value: "month", label: value == 1 ? "month" : "months" },
    ]
}