import { Text } from "@mantine/core"
import { SquareX, Variable } from "tabler-icons-react"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"


export default {
    id: "basic:SetVariable",
    name: "Set Variable",
    description: "Sets the value of a variable.",
    icon: Variable,

    tags: ["Advanced", "Variables"],
    showMainTag: false,

    inputs: [
        {
            id: "name",
            name: "Variable Name",
            description: "The name of the variable to set.",
            tooltip: "The name of the variable to set.",
            icon: Variable,
            allowedModes: ["config"],
            defaultMode: "config",
        },
        {
            id: "value",
            description: "The value of the variable.",
            tooltip: "The value of the variable.",
            icon: SquareX,
            allowedModes: ["config", "handle"],
        },
    ],
    outputs: [],

    renderName: () => {
        const [nameMode] = useInputMode(null, "name")
        const [name] = useInputValue(null, "name")
        const [valueMode] = useInputMode(null, "value")
        const [value] = useInputValue(null, "value")

        if (nameMode == InputMode.Handle)
            return "Set Variable"

        if (!name)
            return "[no name]"

        return <Text transform="none">
            {name}
            {valueMode == InputMode.Config ? ` = "${value}"` : ""}
        </Text>
    },
}