import { ArrowsDiff } from "tabler-icons-react"

export default {
    name: "Conditional",
    description: "Conditionally outputs a value.",
    icon: ArrowsDiff,
    valueTargets: [
        "condition",
        { name: "a", label: "If True" },
        { name: "b", label: "If False" },
    ],
    valueSources: ["out"],
}