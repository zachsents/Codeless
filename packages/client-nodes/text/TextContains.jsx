import { AlphabetLatin, BracketsContain, CircuitSwitchOpen, Target } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"
import TextOrRegexControl from "../components/TextOrRegexControl"


export default {
    id: "text:TextContains",
    name: "Contains",
    description: "Checks if text contains a value or pattern.",
    icon: BracketsContain,

    tags: ["Text", "Regex"],

    inputs: [
        {
            id: "text",
            description: "The text to search.",
            tooltip: "The text to search.",
            icon: AlphabetLatin,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "target",
            description: "The text or Regex to search for.",
            tooltip: "The text or Regex to search for.",
            icon: Target,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: TextOrRegexControl,
        },
    ],
    outputs: [
        {
            id: "result",
            description: "Whether or not the text contains the target.",
            tooltip: "Whether or not the text contains the target.",
            icon: CircuitSwitchOpen,
        },
    ],
}