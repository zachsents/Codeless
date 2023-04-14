import { ArrowBigRight } from "tabler-icons-react"
import { ArrowNarrowRight } from "tabler-icons-react"
import { EqualNot } from "tabler-icons-react"

export default {
    id: "basic:NotEqual",
    name: "Not Equal",
    description: "Tests if things are not equal.",
    icon: EqualNot,

    tags: ["Logic", "Operations"],

    inputs: [
        {
            id: "input",
            description: "The inputs for which to check inequality. Lists are compared element-wise.",
            tooltip: "The inputs for which to check inequality. Lists are compared element-wise.",
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