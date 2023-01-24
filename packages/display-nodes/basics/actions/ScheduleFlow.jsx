import { CalendarTime } from "tabler-icons-react"
import { Select } from "@mantine/core"
import { useOtherFlows } from "../../hooks"


export default {
    id: "basic:ScheduleFlow",
    name: "Schedule Flow",
    description: "Schedules a flow",
    icon: CalendarTime,
    
    inputs: ["payload", "$time"],
    outputs: [],

    configuration: ({ state, setState, appId, flowId, firestore }) => {

        const setFlow = flow => setState({ flow })

        const [otherFlows] = useOtherFlows({
            appId,
            flowId,
            firestore,
            setFlow,
        })

        return (
            <Select
                label="Flow"
                placeholder="Pick a flow"
                data={otherFlows}
                value={state.flow ?? null}
                onChange={setFlow}
            />
        )
    }
}