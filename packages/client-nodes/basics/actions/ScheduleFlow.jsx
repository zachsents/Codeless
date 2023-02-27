import { ControlStack, OtherFlowsControl } from "../../components/index"
import { CalendarTime } from "tabler-icons-react"

import { useNodeContext, useNodeState } from "@minus/graph-util"


export default {
    id: "basic:ScheduleFlow",
    name: "Schedule Flow",
    description: "Schedules a flow",
    icon: CalendarTime,

    inputs: ["payload", "$time"],
    outputs: [],

    configuration: () => {

        const { flowId, appId } = useNodeContext()
        const [state, setState] = useNodeState()

        return (
            <ControlStack>
                <OtherFlowsControl {...{ state, setState, flowId, appId }} />
            </ControlStack>
        )
    }
}