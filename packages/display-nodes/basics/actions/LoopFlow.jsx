import { Select } from "@mantine/core"
import { ArrowIteration } from "tabler-icons-react"
import { useOtherFlows } from "../../hooks"


export default {
    id: "basic:LoopFlow",
    name: "Loop Flow",
    description: "Runs a flow multiple times with different payloads.",
    icon: ArrowIteration,

    inputs: ["list"],
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

