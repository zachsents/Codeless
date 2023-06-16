import { ClipboardData, ListCheck } from "tabler-icons-react"
import InferControl from "../../components/InferControl"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:AddRows",
    name: "Add Row(s)",
    description: "Adds rows to a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
        {
            id: "data",
            description: "The data to add to the rows.",
            tooltip: "The data to add to the rows.",
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
            id: "addedRows",
            description: "The rows that were added.",
            tooltip: "The rows that were added.",
            icon: ListCheck,
            defaultShowing: false,
        },
    ],
}
