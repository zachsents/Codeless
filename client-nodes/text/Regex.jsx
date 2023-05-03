import { Regex } from "tabler-icons-react"
import RegexControl from "../components/RegexControl"


export default {
    id: "text:Regex",
    name: "Regex",
    description: "Creates a Regex.",
    icon: Regex,

    tags: ["Text", "Regex"],

    inputs: [
        {
            id: "$pattern",
            name: "Pattern",
            description: "The Regex pattern.",
            tooltip: "The Regex pattern.",
            icon: Regex,
            allowedModes: ["config"],
            defaultMode: "config",
            renderConfiguration: null,
        },
    ],
    outputs: [
        {
            id: "$",
            name: "Regex Pattern",
            description: "The Regex pattern.",
            tooltip: "The Regex pattern.",
            icon: Regex,
        },
    ],

    renderContent: props => {
        return <RegexControl inputId="$pattern" {...props} />
    },
}
