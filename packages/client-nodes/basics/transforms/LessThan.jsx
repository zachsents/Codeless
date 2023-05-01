import { ArrowBigRight, ArrowNarrowRight, MathLower } from "tabler-icons-react"


export default {
    id: "basic:LessThan",
    name: "Less Than",
    description: "Compares two numbers.",
    icon: MathLower,

    tags: ["Logic", "Operations"],

    inputs: [
        {
            id: "input",
            description: "The inputs to compare. Lists are compared element-wise.",
            tooltip: "The inputs to compare. Lists are compared element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the comparison. True or false.",
            tooltip: "The result of the comparison. True or false.",
            icon: ArrowBigRight,
        }
    ],
}