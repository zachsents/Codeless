import { ClipboardData, ListCheck } from "tabler-icons-react"
import InferControl from "../../components/InferControl"
import { RowsInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:UpdateRows",
    name: "Update Row(s)",
    description: "Updates rows in a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        RowsInput("The rows to update."),
        {
            id: "data",
            description: "The data to update the row with.",
            tooltip: "The data to update the row with.",
            icon: ClipboardData,
            listMode: "named",
            defaultList: 1,
            listNamePlaceholder: "Column Name",
            allowedModes: ["handle", "config"],
            renderConfiguration: props => <InferControl {...props} inputProps={{
                placeholder: "Cell Value",
            }} />,
        },
    ],
    outputs: [
        {
            id: "updatedRows",
            description: "The updated rows.",
            tooltip: "The updated rows.",
            icon: ListCheck,
            defaultShowing: false,
        },
    ],
}
