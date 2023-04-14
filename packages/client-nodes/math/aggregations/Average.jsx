import { BracketsContain, Equal, LayoutAlignMiddle } from "tabler-icons-react"

export default {
    id: "math:Average",
    name: "Average",
    description: "Averages numbers.",
    icon: LayoutAlignMiddle,

    tags: ["Math"],

    inputs: [
        {
            id: "list",
            description: "List of numbers to average.",
            tooltip: "List of numbers to average.",
            icon: BracketsContain,
        },
    ],
    outputs: [
        {
            id: "result",
            description: "Average of the numbers.",
            tooltip: "Average of the numbers.",
            icon: Equal,
        },
    ],
}