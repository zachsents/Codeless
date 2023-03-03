import { ListNumbers } from "tabler-icons-react"


export default {
    id: "basic:ListRepeat",
    name: "Repeat",
    description: "Makes a list of the specified value repeated the number of times specified.",
    icon: ListNumbers,
    badge: "Lists",

    inputs: ["value", "count"],
    outputs: ["list"],    
}