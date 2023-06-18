import { ArrowNarrowRight, Equal, Plus } from 'tabler-icons-react'

export default {
    id: "math:Add",
    name: "Add",
    description: "Adds numbers.",
    icon: Plus,

    tags: ["Math", "Operations"],

    inputs: [
        {
            id: "input",
            type: "number",
            description: "The inputs to add together. Lists are computed element-wise.",
            tooltip: "The inputs to add together. Lists are computed element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            listNameLabel: "Operand",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            type: "number",
            description: "The result of the addition.",
            tooltip: "The result of the addition.",
            icon: Equal,
        }
    ],
}