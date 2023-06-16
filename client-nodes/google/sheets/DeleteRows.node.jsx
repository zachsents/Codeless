import { RowsInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:DeleteRows",
    name: "Delete Rows",
    description: "Deletes the Google Sheets rows.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [RowsInput("The rows to delete.")],
}
