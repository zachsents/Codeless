import { SiGooglesheets } from "react-icons/si"
import { BoxAlignLeft } from "tabler-icons-react"


export default {
    name: "Get Named Column",
    description: "Gets the data from a named column in a table.",
    icon: BoxAlignLeft,
    color: "green",
    valueTargets: [
        { name: "spreadsheetId", label: "Spreadsheet ID" },
        "sheetName",
        "columnName",
    ],
    valueSources: ["data"],
}