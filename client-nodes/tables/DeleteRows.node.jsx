import { LayoutList, Table } from "tabler-icons-react"


export default {
    id: "tables:DeleteRows",
    name: "Delete Rows",
    description: "Deletes rows from a table.",
    icon: Table,
    color: "yellow",

    tags: ["Tables"],

    inputs: [
        {
            id: "rows",
            description: "The row(s) to delete.",
            tooltip: "The row(s) to delete.",
            icon: LayoutList,
        },
    ],
    outputs: [],
}