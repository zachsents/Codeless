import { BoxMultiple, ListSearch, RowInsertBottom, Search, Table } from "tabler-icons-react"
import B from "../components/B"
import CheckboxControl from "../components/CheckboxControl"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"


export default {
    id: "tables:FindRowsByField",
    name: "Find Rows By Field",
    description: "Searches for rows with a a certain value for the specified field. For more advanced searching, try the Query Rows node.",
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
        {
            id: "field",
            description: "The field (column name) to search by.",
            tooltip: "The field (column name) to search by.",
            icon: RowInsertBottom,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "value",
            description: "The value to search for.",
            tooltip: "The value to search for.",
            icon: Search,
            allowedModes: ["handle", "config"],
        },
        {
            id: "multiple",
            description: "Whether to return multiple rows or just the first one.",
            tooltip: "Whether to return multiple rows or just the first one.",
            icon: BoxMultiple,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: true,
            renderConfiguration: CheckboxControl,
        },
    ],
    outputs: [
        {
            id: "rows",
            description: "The rows that match the search.",
            tooltip: "The rows that match the search.",
            icon: ListSearch,
        },
    ],

    renderTextContent: () => {
        const [field] = useInputValue(null, "field")
        const [mode] = useInputMode(null, "field")
        return field && mode == InputMode.Config && <>Searching <B>{field}</B></>
    },
}