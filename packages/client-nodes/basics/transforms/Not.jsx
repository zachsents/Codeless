import { ArrowBigRight } from "tabler-icons-react"
import { ArrowNarrowRight } from "tabler-icons-react"
import { ExclamationMarkOff } from "tabler-icons-react"

export default {
    id: "basic:Not",
    name: "Not",
    description: "Negate condition. NOT this.",
    icon: ExclamationMarkOff,

    tags: ["Logic", "Operations"],

    inputs: [
        {
            id: "input",
            description: "The inputs to negate. Lists are computed element-wise.",
            tooltip: "The inputs to negate. Lists are computed element-wise.",
            icon: ArrowNarrowRight,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the negation. True or false.",
            tooltip: "The result of the negation. True or false.",
            icon: ArrowBigRight,
        }
    ],
}