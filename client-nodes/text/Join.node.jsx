import { AlphabetLatin, Dots, PlugConnected, TriangleSquareCircle } from "tabler-icons-react"
import SelectControl from "../components/SelectControl"
import TextControl from "../components/TextControl"
import { useInputValue } from "../hooks/nodes"
import TextAreaControl from "../components/TextAreaControl"


export default {
    id: "text:Join",
    name: "Join Text",
    description: "Converts a list into text using custom parameters.",
    icon: AlphabetLatin,

    tags: ["Text"],

    inputs: [
        {
            id: "text",
            description: "The text to join.",
            tooltip: "The text to join.",
            icon: AlphabetLatin,
            listMode: "unnamed",
            defaultList: 2,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "mode",
            description: "The mode to join the text in.",
            tooltip: "The mode to join the text in.",
            icon: TriangleSquareCircle,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: "conjunction",
            renderConfiguration: props => <SelectControl {...props} data={[
                { label: "Conjunction (and)", value: "conjunction" },
                { label: "Disjunction (or)", value: "disjunction" },
                { label: "Custom", value: "custom" },
            ]} />,
        },
        {
            id: "join",
            description: "The text your list items are joined by.",
            tooltip: "The text your list items are joined by. Used if the mode is set to 'Custom'.",
            icon: PlugConnected,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            renderConfiguration: props => {
                const [mode] = useInputValue(null, "mode")
                return <TextControl {...props} inputProps={{
                    disabled: mode !== "custom",
                }} />
            },
        },
    ],
    outputs: [
        {
            id: "joinedText",
            name: "Joined",
            type: "text",
            description: "The joined text.",
            tooltip: "The joined text.",
            icon: Dots,
        },
    ],
}