import { Numbers } from "tabler-icons-react"
import { BracketsContain } from "tabler-icons-react"
import { SquareX } from "tabler-icons-react"
import { ListNumbers } from "tabler-icons-react"
import NumberControl from "../components/NumberControl"


export default {
    id: "lists:ListRepeat",
    name: "Repeat",
    description: "Makes a list of the specified value repeated the number of times specified.",
    icon: ListNumbers,

    tags: ["Lists"],

    inputs: [
        {
            id: "$value",
            description: "The value to repeat.",
            tooltip: "The value to repeat.",
            icon: SquareX,
            allowedModes: ["config", "handle"],
        },
        {
            id: "$count",
            type: "number",
            description: "The number of times to repeat the value.",
            tooltip: "The number of times to repeat the value.",
            icon: Numbers,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            renderConfiguration: props => <NumberControl {...props} inputProps={{ min: 0 }} />,
        },
    ],
    outputs: [
        {
            id: "list",
            description: "The list of repeated values.",
            tooltip: "The list of repeated values.",
            icon: BracketsContain,
        }
    ],
}