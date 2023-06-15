import { List } from "tabler-icons-react"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:GetAllRows",
    name: "Get All Rows",
    description: "Get all rows in a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
    ],

    outputs: [
        {
            id: "rows",
            description: "The rows.",
            tooltip: "The rows.",
            icon: List,
        },
    ],
}
