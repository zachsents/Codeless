import { ArrowsSplit2 } from "tabler-icons-react"

export default {
    name: "Unbind",
    description: "Unbinds and stores a value from a signal.",
    icon: ArrowsSplit2,
    valueSources: ["value"],
    signalTargets: ["signal"],
    signalSources: ["out"],
}