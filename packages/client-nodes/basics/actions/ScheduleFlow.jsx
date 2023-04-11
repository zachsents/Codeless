import { BoxSeam, CalendarTime, ChartDots3, Clock } from "tabler-icons-react"
import OtherFlowsControl from "../../components/OtherFlowsControl"
import DateTimeControl from "../../components/DateTimeControl"

/**
 * @type {import("../../DefaultTemplate.jsx").NodeTypeDefinition}
 */
export default {
    id: "basic:ScheduleFlow",
    name: "Schedule Flow",
    description: "Schedules a flow",
    icon: CalendarTime,

    tags: ["Flows"],
    showMainTag: false,

    inputs: [
        {
            id: "flow",
            description: "The flow to run. If used as a handle, the flow ID must be provided.",
            tooltip: "The flow to run. If used as a handle, the flow ID must be provided.",
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            icon: ChartDots3,
            renderConfiguration: OtherFlowsControl,
        },
        {
            id: "$time",
            name: "Date & Time",
            description: "The time to run the flow at.",
            tooltip: "The time to run the flow at.",
            icon: Clock,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            renderConfiguration: DateTimeControl,
        },
        {
            id: "payload",
            description: "The payload to run the flow with.",
            tooltip: "The payload to run the flow with.",
            icon: BoxSeam,
        },

    ],
    outputs: [],
}