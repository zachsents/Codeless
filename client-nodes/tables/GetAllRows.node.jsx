import { List, Table } from "tabler-icons-react"


export default {
    id: "tables:GetAllRows",
    name: "Get All Rows",
    description: "Gets all rows from a table.",
    icon: Table,
    color: "yellow",

    tags: ["Tables"],

    inputs: [
        {
            id: "$table",
            description: "The table to search.",
            tooltip: "The table to search.",
            icon: Table,
        },
    ],
    outputs: [
        {
            id: "rows",
            description: "The rows from the table.",
            tooltip: "The rows from the table.",
            icon: List,
        },
    ],
}