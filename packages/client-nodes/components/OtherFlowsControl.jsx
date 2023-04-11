import { Loader, Select } from "@mantine/core"

import { useOtherFlows } from "../hooks"


export default function OtherFlowsControl({ value, setValue, flowId, appId }) {

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