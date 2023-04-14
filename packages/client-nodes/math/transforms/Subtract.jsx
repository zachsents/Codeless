import { ArrowNarrowRight, Equal, Minus } from "tabler-icons-react"

export default {
    id: "math:Subtract",
    name: "Subtract",
    description: "Subtracts numbers.",
    icon: Minus,

    tags: ["Math", "Operations"],

    inputs: [
        {
            id: "input",
            description: "The inputs to subtract. Lists are computed element-wise.",
            tooltip: "The inputs to subtract. Lists are computed element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the subtraction.",
            tooltip: "The result of the subtraction.",
            icon: Equal,
        }
    ],
}