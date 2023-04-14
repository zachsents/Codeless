import { RowInsertBottom, Table, Variable } from "tabler-icons-react"
import B from "../components/B"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"


export default {
    id: "tables:TableField",
    name: "Table Field",
    description: "Represents a field from a table. Useful as an input to conditions for querying tables.",
    icon: Table,
    color: "yellow",

    tags: ["Tables", "Advanced"],

    inputs: [
        {
            id: "field",
            name: "Field Name",
            description: "The name of the field or column you wish to target.",
            tooltip: "The name of the field or column you wish to target.",
            icon: RowInsertBottom,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
    ],
    outputs: [
        {
            id: "$",
            name: "Field",
            description: "Represents the field.",
            tooltip: "Represents the field.",
            icon: Variable,
        },
    ],

    renderTextContent: () => {
        const [field] = useInputValue(null, "field")
        const [mode] = useInputMode(null, "field")
        return field && mode == InputMode.Config && <B>{field}</B>
    },
}