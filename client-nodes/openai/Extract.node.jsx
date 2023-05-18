import { ArrowNarrowRight, FileText, Target } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"
import { OpenAIIcon } from "./shared"


export default {
    id: "openai:Extract",
    name: "Extract Text",
    description: "Use AI to extract targets from text.",
    icon: OpenAIIcon,
    color: "dark",

    tags: ["Open AI", "AI"],

    inputs: [
        {
            id: "text",
            type: "text",
            description: "The text to extract from.",
            tooltip: "The text to extract from.",
            icon: FileText,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "target",
            type: "text",
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
            type: "text",
            name: "Extracted",
            description: "The data extracted from the text.",
            tooltip: "The data extracted from the text.",
            icon: ArrowNarrowRight,
        },
    ],
}