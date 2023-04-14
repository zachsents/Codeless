import { ClipboardData, RowInsertTop, Table, TableImport } from "tabler-icons-react"


export default {
    id: "tables:AddRow",
    name: "Add Row",
    description: "Adds a row to a table.",
    icon: TableImport,
    color: "yellow",

    tags: ["Tables"],

    inputs: [
        {
            id: "$table",
            description: "The table to add a row to.",
            tooltip: "The table to add a row to.",
            icon: Table,
        },
        {
            id: "data",
            description: "The data to add to the row.",
            tooltip: "The data to add to the row.",
            icon: ClipboardData,
            listMode: "named",
            defaultList: 1,
            allowedModes: ["handle", "config"],
        },
    ],
    outputs: [
        {
            id: "newRow",
            description: "The new row.",
            tooltip: "The new row.",
            icon: RowInsertTop,
            defaultShowing: false,
        },
    ],
}
