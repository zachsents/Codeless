import { ControlStack, OtherFlowsControl } from "../../components"
import { Run } from "tabler-icons-react"


export default {
    id: "basic:RunFlow",
    name: "Run Flow",
    description: "Runs a flow",
    icon: Run,

    inputs: ["payload"],
    outputs: [],

    configuration: ({ state, setState, flowId, appId }) => {

        return (
            <ControlStack>
                <OtherFlowsControl {...{ state, setState, flowId, appId }} />
            </ControlStack>
        )
    }
}