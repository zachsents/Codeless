import { Text } from "@mantine/core"
import { SquareX, Variable } from "tabler-icons-react"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"


export default {
    id: "basic:UseVariable",
    name: "Use Variable",
    description: "Outputs the value of a variable.",
    icon: Variable,

    tags: ["Advanced", "Variables"],
    showMainTag: false,

    inputs: [
        {
            id: "name",
            name: "Variable Name",
            description: "The name of the variable to use.",
            tooltip: "The name of the variable to use.",
            icon: Variable,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
        },
    ],
    outputs: [
        {
            id: "$",
            name: "Value",
            description: "The value of the variable.",
            tooltip: "The value of the variable.",
            icon: SquareX,
        },
    ],

    renderName: () => {
        const [nameMode] = useInputMode(null, "name")
        const [name] = useInputValue(null, "name")

        if (nameMode == InputMode.Handle)
            return "Use Variable"

        return name ?
            <Text transform="none">{name}</Text> :
            "[no name]"
    },
}