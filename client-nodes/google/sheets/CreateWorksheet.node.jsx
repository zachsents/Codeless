import { BoxAlignTop, Table, Typography } from "tabler-icons-react"
import NumberControl from "../../components/NumberControl"
import { SpreadsheetURLInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"
import { useSpreadsheetURL } from "./shared/hooks"


/**
 * Disabled PDF for now, throws an error. It's probably either a billing or scope thing,
 * as I think it's part of the Drive API, not Sheets.
 */

export default {
    id: "googlesheets:CreateWorksheet",
    name: "Create New Worksheet",
    description: "Creates a new worksheet in a Google Sheet document.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SpreadsheetURLInput,
        {
            id: "$name",
            description: "The name of the new worksheet.",
            tooltip: "The name of the new worksheet.",
            icon: Typography,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "$headerRow",
            description: "The row of the table which contains the headers (column names) for the table. Leave blank to not add headers.",
            tooltip: "The row of the table which contains the headers (column names) for the table. Leave blank to not add headers.",
            icon: BoxAlignTop,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 1,
            renderConfiguration: props => <NumberControl {...props} inputProps={{
                min: 1,
            }} />,
        },
        {
            id: "$headers",
            description: "The headers (column names) for the table. Leave blank to not add headers.",
            tooltip: "The headers (column names) for the table. Leave blank to not add headers.",
            icon: BoxAlignTop,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            listMode: "unnamed",
            listNameLabel: "Column",
            defaultList: 1,
        }
    ],
    outputs: [
        {
            id: "sheet",
            description: "The new worksheet.",
            tooltip: "The new worksheet.",
            icon: Table,
        },
    ],

    requiredIntegrations: ["google"],

    useNodePresent: () => {
        useSpreadsheetURL()
    },
}
