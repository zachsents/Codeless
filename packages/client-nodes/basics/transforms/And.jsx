import { Ampersand, ArrowBigRight, ArrowNarrowRight } from "tabler-icons-react"

export default {
    id: "basic:And",
    name: "And",
    description: "Combine conditions. This AND that AND something else.",
    icon: Ampersand,

    tags: ["Logic", "Operations"],

    inputs: [
        {
            id: "input",
            description: "The inputs to AND together. Lists are computed element-wise.",
            tooltip: "The inputs to AND together. Lists are computed element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the operation. True or false.",
            tooltip: "The result of the operation. True or false.",
            icon: ArrowBigRight,
        }
    ],
}