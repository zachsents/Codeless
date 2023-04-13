import { ArrowBigRight, ArrowsJoin, Check, Variable, X } from "tabler-icons-react"


export default {
    id: "basic:Ternary",
    name: "Choose Between Values",
    description: "Chooses between two values.",
    icon: ArrowsJoin,

    tags: ["Conditional"],

    inputs: [
        {
            id: "condition",
            description: "The condition to evaluate.",
            tooltip: "The condition to evaluate.",
            icon: Variable,
        },
        {
            id: "ifTrue",
            name: "If True",
            description: "The value passed to output if the condition is true.",
            tooltip: "The value passed to output if the condition is true.",
            icon: Check,
            allowedModes: ["handle", "config"],
        },
        {
            id: "ifFalse",
            name: "If False",
            description: "The value passed to output if the condition is false.",
            tooltip: "The value passed to output if the condition is false.",
            icon: X,
            allowedModes: ["handle", "config"],
        },
    ],
    outputs: [
        {
            id: "output",
            description: "The value chosen by the condition.",
            tooltip: "The value chosen by the condition.",
            icon: ArrowBigRight,
        },
    ],

    renderName: () => "Choose",
}