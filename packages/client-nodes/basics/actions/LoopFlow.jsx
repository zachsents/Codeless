import { ArrowIteration, ChartDots3, List } from "tabler-icons-react"
import { OtherFlowsControl } from "../../components/index"

/**
 * @type {import("../../DefaultTemplate.jsx").NodeTypeDefinition}
 */
export default {
    id: "basic:LoopFlow",
    name: "Loop Flow",
    description: "Runs a flow multiple times with different payloads.",
    icon: ArrowIteration,

    tags: ["Flows"],
    showMainTag: false,

    inputs: [
        {
            id: "list",
            description: "The list of payloads to run the flow with.",
            tooltip: "The list of payloads to run the flow with.",
            icon: List,
        },
        {
            id: "flow",
            description: "The flow to run. If used as a handle, the flow ID must be provided.",
            allowedModes: ["config", "handle"],
            tooltip: "The flow to run. If used as a handle, the flow ID must be provided.",
            defaultMode: "config",
            icon: ChartDots3,
            renderConfiguration: OtherFlowsControl,
        }
    ],
    outputs: [],
}

