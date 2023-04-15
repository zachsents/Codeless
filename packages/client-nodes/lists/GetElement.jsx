import { BracketsContain, Numbers, Target } from "tabler-icons-react"
import NumberControl from "../components/NumberControl"


export default {
    id: "lists:GetElement",
    name: "Get Element",
    description: "Gets an element from a list.",
    icon: BracketsContain,

    tags: ["Lists"],

    inputs: [
        {
            id: "list",
            description: "The list.",
            tooltip: "The list.",
            icon: BracketsContain,
        },
        {
            id: "index",
            name: "Position",
            description: "The index of the element to get. The first element is at index 0.",
            tooltip: "The index of the element to get. The first element is at index 0.",
            icon: Numbers,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 0,
            renderConfiguration: NumberControl,
        },
    ],
    outputs: [
        {
            id: "element",
            description: "The element at the specified index.",
            tooltip: "The element at the specified index.",
            icon: Target,
        },
    ],
}