import { Numbers } from "tabler-icons-react"
import { BracketsContain } from "tabler-icons-react"
import { ListNumbers } from "tabler-icons-react"

/** 
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "basic:Count",
    name: "Count Items",
    description: "Counts how many items are in a list.",
    icon: ListNumbers,

    tags: ["Lists"],

    inputs: [
        {
            id: "list",
            description: "The list to count.",
            tooltip: "The list to count.",
            icon: BracketsContain,
        }
    ],
    outputs: [
        {
            id: "count",
            description: "The number of items in the list.",
            tooltip: "The number of items in the list.",
            icon: Numbers,
        }
    ],
}
