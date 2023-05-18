import { CalendarTime, Settings } from "tabler-icons-react"
import DateTimeControl from "../components/DateTimeControl"
import SelectControl from "../components/SelectControl"
import { useInputValue } from "../hooks/nodes"


export default {
    id: "basic:FormatDateTime",
    name: "Format Date/Time",
    description: "Turn a date/time into text.",
    icon: CalendarTime,

    tags: ["Time", "Basics"],
    showMainTag: false,

    inputs: [
        {
            id: "date",
            name: "Date/Time",
            description: "The date/time.",
            tooltip: "The date/time.",
            icon: CalendarTime,
            allowedModes: ["config", "handle"],
            renderConfiguration: DateTimeControl,
        },
        {
            id: "type",
            name: "Format Type",
            description: "Whether to include the date, time, or both.",
            tooltip: "Whether to include the date, time, or both.",
            icon: Settings,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: "both",
            renderConfiguration: props => <SelectControl {...props} data={[
                { value: "date", label: "Just Date" },
                { value: "time", label: "Just Time" },
                { value: "both", label: "Date & Time" },
            ]} />,
        },
    ],
    outputs: [
        {
            id: "formatted",
            description: "The formatted date/time.",
            tooltip: "The formatted date/time.",
        }
    ],
}