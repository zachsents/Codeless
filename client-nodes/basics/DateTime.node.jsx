import { CalendarTime } from "tabler-icons-react"
import DateTimeControl from "../components/DateTimeControl"
import { useInputValue } from "../hooks/nodes"

export default {
    id: "basic:DateTime",
    name: "Date & Time",
    description: "Giving you the time of day.",
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