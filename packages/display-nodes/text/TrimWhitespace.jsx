import { AlphabetLatin } from "tabler-icons-react"


export default {
    id: "text:TrimWhitespace",
    name: "Trim Whitespace",
    description: "Trims whitespace (spaces, tabs, line breaks, etc.) from the beginning and end of text.",
    icon: AlphabetLatin,

    inputs: ["inputText"],
    outputs: ["trimmedText"],
}