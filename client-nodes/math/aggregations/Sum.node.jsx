import { BracketsContain, Equal, Sum } from 'tabler-icons-react'

export default {
    id: "math:Sum",
    name: "Sum",
    description: "Adds all items in a list.",
    icon: Sum,

    tags: ["Math"],

    inputs: [
        {
            id: "list",
            description: "List of numbers to sum.",
            tooltip: "List of numbers to sum.",
            icon: BracketsContain,
        },
    ],
    outputs: [
        {
            id: "result",
            description: "Sum of the numbers.",
            tooltip: "Sum of the numbers.",
            icon: Equal,
        }
    ],
}