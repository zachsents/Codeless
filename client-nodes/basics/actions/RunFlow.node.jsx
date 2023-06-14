import { ArrowForward, BoxSeam, ChartDots3, Run } from "tabler-icons-react"
import OtherFlowsControl from "../../components/OtherFlowsControl"

/**
 * @type {import("../../DefaultTemplate.jsx").NodeTypeDefinition}
 */
export default {
    id: "basic:RunFlow",
    name: "Run Flow",
    description: "Runs a flow",
    icon: Run,

    tags: ["Flows"],
    showMainTag: false,

    inputs: [
        {
            id: "payload",
            description: "The payload to run the flow with.",
            tooltip: "The payload to run the flow with.",
            icon: BoxSeam,
        },
        {
            id: "flow",
            description: "The flow to run. If used as a handle, the flow ID must be provided.",
            tooltip: "The flow to run. If used as a handle, the flow ID must be provided.",
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            icon: ChartDots3,
            renderConfiguration: OtherFlowsControl,
        }
    ],
    outputs: [
        {
            id: "return",
            description: "The data returned from the flow.",
            tooltip: "The data returned from the flow.",
            icon: ArrowForward,
            defaultShowing: false,
        }
    ],
}