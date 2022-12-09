import { SiGooglesheets } from "react-icons/si"


export default {
    name: "Get Named Column",
    description: "Gets the data from a named column in a table.",
    icon: SiGooglesheets,
    color: "green",
    valueTargets: [
        { name: "spreadsheetId", label: "Spreadsheet ID" },
        "sheetName",
        "columnName",
    ],
    valueSources: ["data"],
}