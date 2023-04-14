import { ClipboardData, LayoutList, RowInsertBottom, Table } from "tabler-icons-react"
import B from "../components/B"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"


export default {
    id: "tables:GetField",
    name: "Get Field",
    description: "Gets a specific field from a row or set of rows.",
    icon: Table,
    color: "yellow",

    tags: ["Tables"],

    inputs: [
        {
            id: "rows",
            description: "The row(s) to get the field from.",
            tooltip: "The row(s) to get the field from.",
            icon: LayoutList,
        },
        {
            id: "field",
            description: "The field to get the data from.",
            tooltip: "The field to get the data from.",
            icon: RowInsertBottom,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
    ],
    outputs: [
        {
            id: "data",
            description: "The data from the field.",
            tooltip: "The data from the field.",
            icon: ClipboardData,
        },
    ],

    renderTextContent: () => {
        const [field] = useInputValue(null, "field")
        const [mode] = useInputMode(null, "field")
        return field && mode == InputMode.Config && <B>{field}</B>
    },
}
