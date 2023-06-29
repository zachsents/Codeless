import { CalendarTime } from "tabler-icons-react"
import DateTimeControl from "../components/DateTimeControl"
import { useInputValue } from "../hooks/nodes"

export default {
    id: "basic:DateTime",
    name: "Fixed Date & Time",
    description: "A fixed date & time. If you want a date & time relative to the time the workflow runs, use the Relative Date & Time node instead.",
    icon: CalendarTime,

    tags: ["Time", "Basics"],
    showMainTag: false,

    inputs: [
        {
            id: "internalDate",
            name: "Date/Time",
            description: "The date & time.",
            tooltip: "The date & time.",
            icon: CalendarTime,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: new Date().toISOString(),
            renderConfiguration: DateTimeControl,
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
        const [value] = useInputValue(null, "internalDate")

        return new Date(value).toLocaleString(undefined, {
            timeStyle: "short",
            dateStyle: "short",
        })
    },
}