import { ListNumbers } from "tabler-icons-react"

export default {
    id: "basic:Count",
    name: "Count Items",
    description: "Counts how many items are in a list.",
    icon: ListNumbers,
    badge: "Lists",

    inputs: ["list"],
    outputs: ["count"],
}
