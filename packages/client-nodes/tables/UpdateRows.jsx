import { ClipboardData, LayoutList, TableShortcut } from "tabler-icons-react"


export default {
    id: "tables:UpdateRows",
    name: "Update Rows",
    description: "Updates rows in a table.",
    icon: TableShortcut,
    color: "yellow",

    tags: ["Tables"],

    inputs: [
        {
            id: "rows",
            description: "The row(s) to update.",
            tooltip: "The row(s) to update.",
            icon: LayoutList,
        },
        {
            id: "data",
            description: "The data to update the row with.",
            tooltip: "The data to update the row with.",
            icon: ClipboardData,
            listMode: "named",
            defaultList: 1,
            allowedModes: ["handle", "config"],
        },
    ],
    outputs: [
        {
            id: "updatedRows",
            description: "The updated rows.",
            tooltip: "The updated rows.",
            icon: LayoutList,
            defaultShowing: false,
        },
    ],
}
