import { ControlStack, OtherFlowsControl } from "../../components/index"
import { ArrowIteration } from "tabler-icons-react"


export default {
    id: "basic:LoopFlow",
    name: "Loop Flow",
    description: "Runs a flow multiple times with different payloads.",
    icon: ArrowIteration,

    inputs: ["list"],
    outputs: [],

    configuration: ({ state, setState, flowId, appId }) => {

        return (
            <ControlStack>
                <OtherFlowsControl {...{ state, setState, flowId, appId }} />
            </ControlStack>
        )
    }
}

