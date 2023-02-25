import { Loader, Select } from "@mantine/core"

import { useOtherFlows } from "../hooks"
import Control from "./Control"
import ControlLabel from "./ControlLabel"


export default function OtherFlowsControl({ state, setState, flowId, appId }) {

    const setFlow = flow => setState({ flow })

    const [otherFlows] = useOtherFlows(flowId, appId, setFlow)

    return (
        <Control>
            <ControlLabel info="The flow that will be ran. The input to this node will be the output of the trigger node in that flow.">
                Flow
            </ControlLabel>
            <Select
                placeholder={otherFlows ? otherFlows.length ? "Pick a flow" : "No other flows" : "Loading flows"}
                data={otherFlows ?? []}
                value={state.flow ?? null}
                onChange={setFlow}
                rightSection={!otherFlows && <Loader size="xs" />}
            />
        </Control>
    )
}