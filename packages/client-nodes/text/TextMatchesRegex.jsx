import { Regex } from "tabler-icons-react"


export default {
    id: "text:TextMatchesRegex",
    name: "Text Matches Regex",
    description: "Checks if text matches Regex.",
    icon: Regex,
    badge: "Text",

    inputs: ["text", "regex"],
    outputs: [
        { name: "_result", label: "True / False" }
    ],
}