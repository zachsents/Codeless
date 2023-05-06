import { Text } from "@mantine/core"
import { SiOpenai } from "react-icons/si"

import { FileText, LineDashed, SquareX, Stars } from "tabler-icons-react"
import B from "../components/B"
import NumberControl from "../components/NumberControl"
import TextAreaControl from "../components/TextAreaControl"
import { useInputValue } from "../hooks/nodes"


export default {
    id: "openai:Rate",
    name: "Rate Text",
    description: "Rates an aspect of a text input on the specified number scale.",
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
            id: "property",
            description: "The property of the text you want to rate. e.g. 'urgency', 'satisfaction'",
            tooltip: <>
                The property of the text you want to rate.<br />
                <Text color="dimmed">e.g. 'urgency', 'satisfaction'</Text>
            </>,
            icon: SquareX,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "scale",
            description: "The scale you want to rate the text on. A value of 10 here provides a rating between 0 and 10.",
            tooltip: "The scale you want to rate the text on. A value of 10 here provides a rating between 0 and 10.",
            icon: LineDashed,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 10,
            renderConfiguration: NumberControl,
        },
    ],
    outputs: [
        {
            id: "result",
            name: "Rating",
            description: "The rating of the text.",
            tooltip: "The rating of the text.",
            icon: Stars,
        },
    ],

    renderTextContent: () => {
        const [property] = useInputValue(null, "property")
        const [scale] = useInputValue(null, "scale")
        return <><B>{property || "[blank]"}</B> out of <B>{scale}</B></>
    },
}