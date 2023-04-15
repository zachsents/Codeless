import { AlphabetLatin, ArrowNarrowRight, Plus, Replace, X } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"
import TextOrRegexControl from "../components/TextOrRegexControl"


export default {
    id: "text:Replace",
    name: "Replace",
    description: "Replace in text.",
    icon: Replace,

    tags: ["Text", "Regex"],

    inputs: [
        {
            id: "text",
            description: "The text to replace in.",
            tooltip: "The text to replace in.",
            icon: AlphabetLatin,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "replaceThis",
            description: "The text or Regex to replace. To use Regex, attach a Regex node to this input.",
            tooltip: "The text or Regex to replace. To use Regex, attach a Regex node to this input.",
            icon: X,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: TextOrRegexControl,
        },
        {
            id: "replaceWith",
            name: "With This",
            description: "The text or Regex to substitute in.",
            tooltip: "The text or Regex to substitute in.",
            icon: Plus,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
    ],
    outputs: [
        {
            id: "result",
            description: "The text with the desired text replaced.",
            tooltip: "The text with the desired text replaced.",
            icon: ArrowNarrowRight,
        },
    ],
}