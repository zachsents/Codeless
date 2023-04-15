import { AlphabetLatin, ArrowNarrowRight, TextDecrease, X } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"
import TextOrRegexControl from "../components/TextOrRegexControl"


export default {
    id: "text:Remove",
    name: "Remove",
    description: "Remove a pattern from some text.",
    icon: TextDecrease,

    tags: ["Text", "Regex"],

    inputs: [
        {
            id: "text",
            description: "The text to remove from.",
            tooltip: "The text to remove from.",
            icon: AlphabetLatin,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "remove",
            description: "The text or Regex to remove. To use Regex, attach a Regex node to this input.",
            tooltip: "The text or Regex to remove. To use Regex, attach a Regex node to this input.",
            icon: X,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: TextOrRegexControl,
        },
    ],
    outputs: [
        {
            id: "result",
            description: "The text with the desired text removed.",
            tooltip: "The text with the desired text removed.",
            icon: ArrowNarrowRight,
        },
    ],
}