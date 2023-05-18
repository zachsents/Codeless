import { BracketsContain, Equal, MathPi } from "tabler-icons-react"

export default {
    id: "math:Product",
    name: "Product",
    description: "Multiplies numbers (Capital pi product notation).",
    icon: MathPi,

    tags: ["Math"],

    inputs: [
        {
            id: "list",
            description: "List of numbers to multiply.",
            tooltip: "List of numbers to multiply.",
            icon: BracketsContain,
        },
    ],
    outputs: [
        {
            id: "result",
            type: "number",
            description: "Product of the numbers.",
            tooltip: "Product of the numbers.",
            icon: Equal,
        }
    ],
}