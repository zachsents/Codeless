import { Group, NumberInput, Select, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { DateTimePicker, TimeInput } from "@mantine/dates"
import { useListState } from "@mantine/hooks"
import { syncType } from "@minus/util"


export default function ScheduleBuilder({ onChange }) {

    const [interval, setInterval] = useState(1)
    const [intervalUnit, setIntervalUnit] = useState("minute")

    // Offset states
    const [atMinute, setAtMinute] = useState(0)
    const [atTime, setAtTime] = useState(null)
    const [onWeekday, setOnWeekday] = useState(1)
    const [onDay, setOnDay] = useState(1)

    // Propagate changes
    useEffect(() => {
        onChange?.({
            interval: interval,
            intervalUnit: intervalUnit,
            ...(intervalUnit == "minute" && {}),
            ...(intervalUnit == "hour" && { atMinute }),
            ...(intervalUnit == "day" && { atTime }),
            ...(intervalUnit == "week" && { onWeekday, atTime }),
            ...(intervalUnit == "month" && { onDay, atTime }),
        })
    }, [interval, intervalUnit, atMinute, atTime, onWeekday, onDay])

    return (
        <Group>
            <Group>
                <Text>Every</Text>
                <NumberInput
                    value={syncType(interval, "number", interval, "")}
                    onChange={newValue => setInterval(syncType(newValue, "number", newValue, null))}
                    min={1} max={100} w="4rem"
                />
                <Select data={INTERVAL_UNITS(interval != 1)} value={intervalUnit} onChange={setIntervalUnit} w="10rem" />
            </Group>

            {intervalUnit == "minute" &&
                <></>}

            {intervalUnit == "hour" &&
                <AtMinutes value={atMinute} onChange={setAtMinute} />}

            {intervalUnit == "day" &&
                <AtTime value={atTime} onChange={setAtTime} />}

            {intervalUnit == "week" &&
                <>
                    <OnWeekday value={onWeekday} onChange={setOnWeekday} />
                    <AtTime value={atTime} onChange={setAtTime} />
                </>}

            {intervalUnit == "month" &&
                <>
                    <OnDay value={onDay} onChange={setOnDay} />
                    <AtTime value={atTime} onChange={setAtTime} />
                </>}
        </Group>
    )
}


function AtMinutes({ value, onChange }) {

    return (
        <Group>
            <Text>at</Text>
            <NumberInput
                min={0} max={59}
                // defaultValue={0}
                value={syncType(value, "number", value, "")}
                onChange={newValue => onChange?.(syncType(newValue, "number", newValue, null))}
            />
            <Text>minutes</Text>
        </Group>
    )
}

function AtTime({ value, onChange }) {

    return (
        <Group>
            <Text>at</Text>
            <TimeInput
                value={syncType(value, "string", value, "")}
                onChange={event => onChange?.(syncType(event.currentTarget.value, "string", x => x || null, null))}
            />
        </Group>
    )
}

function OnWeekday({ value, onChange }) {

    return (
        <Group>
            <Text>on</Text>
            <Select
                data={WEEKDAYS}
                // defaultValue="monday"
                value={syncType(value, "number", x => WEEKDAYS[x].value, null)}
                onChange={newValue => onChange?.(
                    syncType(newValue, "string", x => WEEKDAYS.findIndex(y => y.value == x), null)
                )}
            />
        </Group>
    )
}

function OnDay({ value, onChange }) {

    const FACTOR = 24 * 60 * 60 * 1000

    return (
        <Group>
            <Text>on the</Text>
            <NumberInput
                min={1} max={31}
                parser={value => value.replaceAll(/\D/g, "")}
                formatter={value => {
                    if (value == null || value === "") return ""

                    switch (new Intl.PluralRules("en", { type: "ordinal" }).select(value)) {
                        case "one": return `${value}st`
                        case "two": return `${value}nd`
                        case "few": return `${value}rd`
                    }

                    return `${value}th`
                }}
                // defaultValue={1}
                value={syncType(value, "number", value, "")}
                onChange={newValue => onChange?.(
                    syncType(newValue, "number", newValue, null)
                )}
            />
            <Text>day</Text>
        </Group>
    )
}


const INTERVAL_UNITS = plural => [
    { value: "minute", label: plural ? "minutes" : "minute" },
    { value: "hour", label: plural ? "hours" : "hour" },
    { value: "day", label: plural ? "days" : "day" },
    { value: "week", label: plural ? "weeks" : "week" },
    { value: "month", label: plural ? "months" : "month" },
]


const WEEKDAYS = [
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
]
