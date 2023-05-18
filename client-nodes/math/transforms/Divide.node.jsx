import { ArrowNarrowRight, Divide, Equal } from "tabler-icons-react"

export default {
    id: "math:Divide",
    name: "Divide",
    description: "Divides numbers.",
    icon: Divide,

    tags: ["Math", "Operations"],

    inputs: [
        {
            id: "input",
            type: "number",
            description: "The inputs to divide. Lists are computed element-wise.",
            tooltip: "The inputs to divide. Lists are computed element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            type: "number",
            description: "The result of the division.",
            tooltip: "The result of the division.",
            icon: Equal,
        }
    ],
}