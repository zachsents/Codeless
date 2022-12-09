import { SiGooglesheets } from "react-icons/si"


export default {
    name: "Set Named Column",
    description: "Sets the data in a named column in a table.",
    icon: SiGooglesheets,
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