import { ArrowsSplit, Check, Square, Variable, X } from "tabler-icons-react"


export default {
    id: "control:If",
    name: "If / Then",
    description: "If the condition is true, the value is passed through the 'then' output. Otherwise, it is passed through the 'otherwise' output.",
    icon: ArrowsSplit,

    tags: ["Conditional"],

    inputs: [
        {
            id: "$condition",
            description: "The condition to check.",
            tooltip: "The condition to check.",
            icon: Variable,
        },
        {
            id: "value",
            description: "The value to pass through to the output. Which output depends on the condition.",
            tooltip: "The value to pass through if the condition is true.",
            icon: Square,
            allowedModes: ["handle", "config"],
        },
    ],
    outputs: [
        {
            id: "then",
            description: "The value passed through if the condition is true.",
            tooltip: "The value passed through if the condition is true.",
            icon: Check,
        },
        {
            id: "otherwise",
            description: "The value passed through if the condition is false.",
            tooltip: "The value passed through if the condition is false.",
            icon: X,
            defaultShowing: false,
        },
    ],
}

