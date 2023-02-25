import { ControlStack, OtherFlowsControl } from "../../components/index"
import { CalendarTime } from "tabler-icons-react"


export default {
    id: "basic:ScheduleFlow",
    name: "Schedule Flow",
    description: "Schedules a flow",
    icon: CalendarTime,
    
    inputs: ["payload", "$time"],
    outputs: [],

    configuration: ({ state, setState, flowId, appId }) => {

        return (
            <ControlStack>
                <OtherFlowsControl {...{ state, setState, flowId, appId }} />
            </ControlStack>
        )
    }
}