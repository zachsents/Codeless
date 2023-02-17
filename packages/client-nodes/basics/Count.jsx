import { ListNumbers } from "tabler-icons-react"

export default {
    id: "basic:Count",
    name: "Count",
    description: "Counts how many items are in a list.",
    icon: ListNumbers,

    inputs: ["list"],
    outputs: ["count"],
}
