import { SiGooglesheets } from "react-icons/si"
import { BoxAlignLeft } from "tabler-icons-react"


export default {
    name: "Set Named Column",
    description: "Sets the data in a named column in a table.",
    icon: BoxAlignLeft,
    color: "green",
    valueTargets: [
        { name: "spreadsheetId", label: "Spreadsheet ID" },
        "sheetName",
        "columnName",
        "data",
    ],
    signalTargets: [" "],
    signalSources: ["  "],
}