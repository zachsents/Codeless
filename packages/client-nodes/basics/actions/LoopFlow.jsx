import { ControlStack, OtherFlowsControl } from "../../components/index"
import { ArrowIteration } from "tabler-icons-react"

import { useNodeContext, useNodeState } from "@minus/graph-util"


export default {
    id: "basic:LoopFlow",
    name: "Loop Flow",
    description: "Runs a flow multiple times with different payloads.",
    icon: ArrowIteration,

    inputs: ["list"],
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

