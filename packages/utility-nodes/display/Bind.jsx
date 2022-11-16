import { ArrowsJoin2 } from "tabler-icons-react"

export default {
    name: "Bind",
    description: "Binds a value to a signal.",
    icon: ArrowsJoin2,
    valueTargets: ["value"],
    signalTargets: ["signal"],
    signalSources: ["out"],
}