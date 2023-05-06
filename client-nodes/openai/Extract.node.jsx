import { SiOpenai } from "react-icons/si"
import { ArrowNarrowRight, FileText } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"
import { Target } from "tabler-icons-react"


export default {
    id: "openai:Extract",
    name: "Extract Text",
    description: "Use AI to extract targets from text.",
    icon: SiOpenai,
    color: "dark",

    tags: ["Open AI", "AI"],

    inputs: [
        {
            id: "text",
            description: "The text to extract from.",
            tooltip: "The text to extract from.",
            icon: FileText,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "target",
            description: "The target to extract.",
            tooltip: "The target to extract.",
            icon: Target,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
    ],
    outputs: [
        {
            id: "result",
            name: "Extracted",
            description: "The data extracted from the text.",
            tooltip: "The data extracted from the text.",
            icon: ArrowNarrowRight,
        },
    ],
}