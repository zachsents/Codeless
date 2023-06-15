import { List } from "tabler-icons-react"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:DeleteRows",
    name: "Delete Rows",
    description: "Deletes the Google Sheets rows.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        {
            id: "rows",
            description: "The rows.",
            tooltip: "The rows.",
            icon: List,
        },
    ],
}
