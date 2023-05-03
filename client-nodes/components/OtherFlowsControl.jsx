import { Loader, Select } from "@mantine/core"
import { useOtherFlows } from "../hooks"
import { useInputValue } from "../hooks/nodes"


export default function OtherFlowsControl({ inputId, flowId, appId }) {

    const [value, setValue] = useInputValue(null, inputId)
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