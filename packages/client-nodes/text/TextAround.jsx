import { AlphabetLatin, ArrowNarrowRight, CircleDashed, Container, Target, Trophy } from "tabler-icons-react"
import CheckboxControl from "../components/CheckboxControl"
import NumberControl from "../components/NumberControl"
import TextAreaControl from "../components/TextAreaControl"
import TextOrRegexControl from "../components/TextOrRegexControl"


export default {
    id: "text:TextAround",
    name: "Surrounding Text",
    description: "Gets the text surrounding a pattern.",
    icon: Container,

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
            description: "The text or Regex to look for.",
            tooltip: "The text or Regex to look for.",
            icon: Target,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: TextOrRegexControl,
        },
        {
            id: "reach",
            description: "How many characters to reach surrounding the target text.",
            tooltip: "How many characters to reach surrounding the target text.",
            icon: CircleDashed,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 50,
            renderConfiguration: NumberControl,
        },
        {
            id: "onlyFirst",
            description: "Whether or not it should only find the first occurrence.",
            tooltip: "Whether or not it should only find the first occurrence.",
            icon: Trophy,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: true,
            renderConfiguration: CheckboxControl,
        },
    ],
    outputs: [
        {
            id: "result",
            description: "The text surrounding the target.",
            tooltip: "The text surrounding the target.",
            icon: ArrowNarrowRight,
        },
    ],
}