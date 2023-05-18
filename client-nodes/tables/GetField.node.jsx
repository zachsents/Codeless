import { ClipboardData, LayoutList, RowInsertBottom, Table } from "tabler-icons-react"
import { InputMode, useInputMode, useInputValue, useTypeDefinition } from "../hooks/nodes"


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
            type: "text",
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

    renderName: () => useTypeDefinition().name +
        (useInputMode(null, "field")[0] == InputMode.Config ?
            ` "${useInputValue(null, "field")[0]}"` :
            ""),
}
