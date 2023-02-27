import { ControlStack, OtherFlowsControl } from "../../components/index"
import { Run } from "tabler-icons-react"

import { useNodeContext, useNodeState } from "@minus/graph-util"


export default {
    id: "basic:RunFlow",
    name: "Run Flow",
    description: "Runs a flow",
    icon: Run,

    inputs: ["payload"],
    outputs: [],

    configuration: () => {

        const {flowId, appId} = useNodeContext()
        const [state, setState] = useNodeState()

        return (
            <ControlStack>
                <OtherFlowsControl {...{ state, setState, flowId, appId }} />
            </ControlStack>
        )
    }
}