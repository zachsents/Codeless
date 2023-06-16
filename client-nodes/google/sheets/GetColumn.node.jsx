import { ClipboardData, Columns, List } from "tabler-icons-react"
import { InputMode, useInputMode, useInputValue } from "../../hooks/nodes"
import { SheetsIcon } from "./shared/misc"
import InferControl from "../../components/InferControl"


export default {
    id: "googlesheets:GetColumn",
    name: "Get Column",
    description: "Gets a column from a Google Sheet or rows from a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        {
            id: "rowsOrSheet",
            name: "Row(s) or Sheet",
            description: "A list of rows from a Google Sheet or a Google Sheet.",
            tooltip: "A list of rows from a Google Sheet or a Google Sheet.",
            icon: List,
        },
        {
            id: "$column",
            description: 'The column to get. Either a column name from a column header ("First Name", "Last Name", etc.), a column letter ("A", "B", "AA", etc.), or a column index (1, 2, 27, etc.).',
            tooltip: 'The column to get. Either a column name from a column header ("First Name", "Last Name", etc.), a column letter ("A", "B", "AA", etc.), or a column index (1, 2, 27, etc.).',
            icon: Columns,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: InferControl,
        },
    ],
    outputs: [
        {
            id: "values",
            name: "Value(s)",
            description: "The values in the column.",
            tooltip: "The values in the column.",
            icon: ClipboardData,
        },
    ],

    renderName: () => {
        const [column] = useInputValue(null, "$column")
        const [columnMode] = useInputMode(null, "$column")

        return `Get Column${columnMode == InputMode.Config && column ? ` "${column}"` : ""}`
    },
}
