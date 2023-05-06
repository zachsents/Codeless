import { ArrowBack, ClipboardData } from "tabler-icons-react"

/** 
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "basic:ReturnFromFlow",
    name: "Return From Flow",
    description: "If this flow was run from a \"Run Flow\" node in another flow, this will return the result to it.",
    icon: ArrowBack,

    inputs: [
        {
            id: "data",
            description: "The data to return.",
            tooltip: "The data to return.",
            icon: ClipboardData,
            allowedModes: ["config", "handle"],
        }
    ],
    outputs: [],
}