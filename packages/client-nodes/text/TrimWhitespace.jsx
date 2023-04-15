import { AlphabetLatin, ArrowNarrowRight } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"


export default {
    id: "text:TrimWhitespace",
    name: "Trim Whitespace",
    description: "Trims whitespace (spaces, tabs, line breaks, etc.) from the beginning and end of text.",
    icon: AlphabetLatin,

    tags: ["Text"],

    inputs: [
        {
            id: "text",
            description: "The text to trim.",
            tooltip: "The text to trim.",
            icon: AlphabetLatin,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
    ],
    outputs: [
        {
            id: "trimmedText",
            description: "The trimmed text.",
            tooltip: "The trimmed text.",
            icon: ArrowNarrowRight,
        },
    ],
}