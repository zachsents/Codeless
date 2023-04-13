import { Ampersand, ArrowBigRight, ArrowNarrowRight } from "tabler-icons-react"

export default {
    id: "basic:And",
    name: "And",
    description: "Combine conditions. This AND that AND something else.",
    icon: Ampersand,

    inputs: [
        {
            id: "input",
            description: "The inputs to AND together. Lists are flattened together.",
            tooltip: "The inputs to AND together. Lists are flattened together.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the AND operation.",
            tooltip: "The result of the AND operation.",
            icon: ArrowBigRight,
        }
    ],
}