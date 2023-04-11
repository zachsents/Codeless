import { Loader, Select } from "@mantine/core"
import { useNodeInputValue, useOtherFlows } from "../hooks"


export default function OtherFlowsControl({ nodeId, inputId, flowId, appId }) {

    const [value, setValue] = useNodeInputValue(nodeId, inputId)
    const [otherFlows] = useOtherFlows(flowId, appId, setValue)

    return (
        <Select
            placeholder={otherFlows ? otherFlows.length ? "Pick a flow" : "No other flows" : "Loading flows"}
            data={otherFlows ?? []}
            value={value ?? null}
            onChange={setValue}
            rightSection={!otherFlows && <Loader size="xs" />}
        />
    )
}