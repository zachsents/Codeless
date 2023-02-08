import { TargetArrow } from "tabler-icons-react"


export default {
    id: "text:Extract",
    name: "Extract Text",
    description: "Extracts text matching a pattern from text.",
    icon: TargetArrow,
    badge: "text",

    inputs: ["text", "pattern"],
    outputs: ["extracted"],
}