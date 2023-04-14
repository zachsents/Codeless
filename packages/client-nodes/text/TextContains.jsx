import { BracketsContain } from "tabler-icons-react"


export default {
    id: "text:TextContains",
    name: "Text Contains",
    description: "Checks if text contains a value.",
    icon: BracketsContain,
    tags: ["Text"],

    inputs: ["text", "containedText"],
    outputs: [
        { name: "_result", label: "True / False" }
    ],
}