import { SiOpenai } from "react-icons/si"


export default {
    id: "openai:AskGPT3",
    name: "Ask GPT",
    description: "Asks GPT a prompt.",
    icon: SiOpenai,
    color: "dark",

    inputs: ["$prompt"],
    outputs: ["response"],

    defaultState: {
        model: "text-davinci-003",
    },
}