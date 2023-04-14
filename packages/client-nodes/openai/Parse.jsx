import { SiOpenai } from "react-icons/si"
import { ArrowNarrowRight, FileText } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"


export default {
    id: "openai:Parse",
    name: "Extract",
    description: "Parse fields out of text with GPT3.",
    icon: SiOpenai,
    color: "dark",

    tags: ["Open AI", "AI"],

    inputs: [
        {
            id: "text",
            description: "The text to classify.",
            tooltip: "The text to classify.",
            icon: FileText,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
    ],
    outputs: [
        {
            id: "data",
            description: "The data extracted from the text.",
            tooltip: "The data extracted from the text.",
            icon: ArrowNarrowRight,
            listMode: "named",
            defaultList: 1,
        },
    ],
}