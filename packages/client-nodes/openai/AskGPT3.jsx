import { SiOpenai } from "react-icons/si"
import { MessageCircle, MessageCircle2, Temperature } from "tabler-icons-react"
import SliderControl from "../components/SliderControl"
import TextAreaControl from "../components/TextAreaControl"


export default {
    id: "openai:AskGPT3",
    name: "ChatGPT",
    description: "Asks ChatGPT a prompt.",
    icon: SiOpenai,
    color: "dark",

    tags: ["Open AI", "AI"],

    inputs: [
        {
            id: "prompt",
            description: "The prompt to ask ChatGPT.",
            tooltip: "The prompt to ask ChatGPT.",
            icon: MessageCircle2,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "temperature",
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
            description: "The response from ChatGPT.",
            tooltip: "The response from ChatGPT.",
            icon: MessageCircle,
        },
    ],
}