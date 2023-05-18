import { MessageCircle, MessageCircle2, Temperature } from "tabler-icons-react"
import SliderControl from "../components/SliderControl"
import TextAreaControl from "../components/TextAreaControl"
import { OpenAIIcon } from "./shared"


export default {
    id: "openai:ChatGPT",
    name: "ChatGPT",
    description: "Asks ChatGPT a prompt.",
    icon: OpenAIIcon,
    color: "dark",

    tags: ["Open AI", "AI"],

    inputs: [
        {
            id: "prompt",
            type: "text",
            description: "The prompt to ask ChatGPT.",
            tooltip: "The prompt to ask ChatGPT.",
            icon: MessageCircle2,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "temperature",
            type: "number",
            description: "How random the response should be.",
            tooltip: "How random the response should be.",
            icon: Temperature,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 1,
            renderConfiguration: props => <SliderControl {...props} inputProps={{
                min: 0,
                max: 1,
                step: 0.01,
                label: val => val.toFixed(2),
            }} />,
        },
    ],
    outputs: [
        {
            id: "response",
            type: "text",
            description: "The response from ChatGPT.",
            tooltip: "The response from ChatGPT.",
            icon: MessageCircle,
        },
    ],
}