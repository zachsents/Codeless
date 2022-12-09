import { ArrowsDiff } from "tabler-icons-react"

export default {
    name: "If",
    description: "Conditionally propagates a signal.",
    icon: ArrowsDiff,
    valueTargets: ["condition"],
    signalTargets: ["in"],
    signalSources: [
        { name: "a", label: "If True" },
        { name: "b", label: "If False" },
    ],
}