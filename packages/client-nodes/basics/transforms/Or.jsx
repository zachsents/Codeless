import { ArrowBigRight } from "tabler-icons-react"
import { ArrowNarrowRight } from "tabler-icons-react"
import { LogicOr } from "tabler-icons-react"

export default {
    id: "basic:Or",
    name: "Or",
    description: "Combine conditions. This OR that OR something else.",
    icon: LogicOr,

    inputs: [
        {
            id: "input",
            description: "The inputs to OR together. Lists are computed element-wise.",
            tooltip: "The inputs to OR together. Lists are computed element-wise.",
            icon: ArrowNarrowRight,
            listMode: "unnamed",
            defaultList: 2,
        }
    ],
    outputs: [
        {
            id: "result",
            description: "The result of the operation. True or false.",
            tooltip: "The result of the operation. True or false.",
            icon: ArrowBigRight,
        }
    ],
}