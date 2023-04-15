import { AlphabetLatin, LetterCaseLower, LetterCaseUpper } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"


export default {
    id: "text:Length",
    name: "Word & Character Count",
    description: "Gives the length of text in either characters or words.",
    icon: AlphabetLatin,
    tags: ["text"],

    inputs: [
        {
            id: "text",
            description: "The text to count.",
            tooltip: "The text to count.",
            icon: AlphabetLatin,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
    ],
    outputs: [
        {
            id: "wordCount",
            description: "The number of words in the text.",
            tooltip: "The number of words in the text.",
            icon: LetterCaseUpper,
        },
        {
            id: "characterCount",
            description: "The number of characters in the text.",
            tooltip: "The number of characters in the text.",
            icon: LetterCaseLower,
        },
    ],
}