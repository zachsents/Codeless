import { ArrowNarrowRight, Equal, X } from "tabler-icons-react"

export default {
    id: "math:Multiply",
    name: "Multiply",
    description: "Multiplies numbers.",
    icon: X,

    tags: ["Math", "Operations"],

    inputs: [
        {
            id: "input",
            description: "The inputs to multiply. Lists are computed element-wise.",
            tooltip: "The inputs to multiply. Lists are computed element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the multiplication.",
            tooltip: "The result of the multiplication.",
            icon: Equal,
        }
    ],
}