import { Dice3, LayoutAlignLeft, LayoutAlignRight, Numbers } from "tabler-icons-react"
import CheckboxControl from "../components/CheckboxControl"
import NumberControl from "../components/NumberControl"
import { useInputValue } from "../hooks/nodes"
import B from "../components/B"

export default {
    id: "math:RandomNumber",
    name: "Random Number",
    description: "Generates a random number.",
    icon: Dice3,

    tags: ["Math"],

    inputs: [
        {
            id: "min",
            name: "Minimum",
            type: "number",
            description: "Minimum value.",
            tooltip: "Minimum value.",
            icon: LayoutAlignLeft,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 1,
            renderConfiguration: NumberControl,
        },
        {
            id: "max",
            name: "Maximum",
            type: "number",
            description: "Maximum value.",
            tooltip: "Maximum value.",
            icon: LayoutAlignRight,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 7,
            renderConfiguration: NumberControl,
        },
        {
            id: "integer",
            type: "boolean",
            name: "Whole Numbers Only",
            description: "Whether to only generate whole numbers.",
            tooltip: "Whether to only generate whole numbers.",
            icon: Numbers,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: true,
            renderConfiguration: CheckboxControl,
        },
    ],
    outputs: [
        {
            id: "$",
            name: "Random",
            type: "number",
            description: "The generated random number.",
            tooltip: "The generated random number.",
            icon: Numbers,
        }
    ],

    renderTextContent: () => {
        const [min] = useInputValue(null, "min")
        const [max] = useInputValue(null, "max")
        const [integer] = useInputValue(null, "integer")
        return <><B>{integer ? "Whole Number" : "Number"}</B> between <B>{min}</B> and <B>{max}</B></>
    },
}