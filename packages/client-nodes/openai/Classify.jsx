import { SiOpenai } from "react-icons/si"
import { FileText, Triangle, TriangleSquareCircle } from "tabler-icons-react"
import B from "../components/B"
import TextAreaControl from "../components/TextAreaControl"
import { useListHandle } from "../hooks/nodes"


export default {
    id: "openai:Classify",
    name: "Classify Text",
    description: "Classifies text as one of the specified categories.",
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
        {
            id: "categories",
            description: "The categories, one of which the text will be classified as.",
            tooltip: "The categories, one of which the text will be classified as.",
            icon: TriangleSquareCircle,
            listMode: "unnamed",
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
    ],
    outputs: [
        {
            id: "category",
            description: "The category the text was classified as.",
            tooltip: "The category the text was classified as.",
            icon: Triangle,
        },
    ],

    renderTextContent: () => {
        const [list] = useListHandle(null, "categories")
        return <><B>{list?.length ?? 0}</B> categor{list?.length == 1 ? "y" : "ies"}</>
    },
}