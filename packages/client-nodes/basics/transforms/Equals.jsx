import { ArrowBigRight, ArrowNarrowRight, Equal } from "tabler-icons-react"

export default {
    id: "basic:Equals",
    name: "Equals",
    description: "Tests if things are equal.",
    icon: Equal,

    tags: ["Logic", "Operations"],

    inputs: [
        {
            id: "input",
            description: "The inputs for which to check equality. Lists are compared element-wise.",
            tooltip: "The inputs for which to check equality. Lists are compared element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the comparison. True or false.",
            tooltip: "The result of the comparison. True or false.",
            icon: ArrowBigRight,
        }
    ],
}